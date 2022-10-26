/*
 * Copyright (c) 2020 - 2022. Kassenärztliche Bundesvereinigung, KBV
 *
 * This file is part of MIO Viewer.
 *
 * MIO Viewer is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Lesser General Public License as published by
 * the Free Software Foundation version 3 of the License only.
 *
 * MIO Viewer is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
 * GNU Lesser General Public License for more details.
 *
 * You should have received a copy of the GNU Lesser General Public License
 * along with MIO Viewer. If not, see <https://www.gnu.org/licenses/>.
 */

import React from "react";

import { MIOConnectorType } from "../../../store";

import { MIOParserResult, KBVBundleResource, MIOParserError } from "@kbv/mioparser";

import { UI } from "../../index";

import purify from "dompurify";

import * as Comlink from "comlink";

// eslint-disable-next-line
/* eslint import/no-webpack-loader-syntax: off */
import ParseWorker from "worker-loader!./Worker.ts";

import "./AddMIOHelper.scss";

export type AddMIOHelperState = {
    files: File[];
    hasError: boolean;
    errorMessage: string;
    errorDetailMessage: string;
    errorDetailMessageToCopy: string;
    numErrors: number;
    bigFile?: boolean;
    tooBig?: boolean;
};

export default class AddMIOHelper {
    private readonly _state: AddMIOHelperState;

    constructor(
        readonly props: MIOConnectorType,
        readonly onParseFiles: () => void,
        readonly onStateChange: () => void
    ) {
        this._state = {
            files: [],
            hasError: false,
            errorMessage: "",
            errorDetailMessage: "",
            errorDetailMessageToCopy: "",
            numErrors: 0,
            bigFile: false,
            tooBig: false
        };
    }

    public get state(): AddMIOHelperState {
        return this._state;
    }

    private setState = (
        newState: Partial<AddMIOHelperState>,
        callback?: () => void
    ): void => {
        for (const key of Object.keys(newState)) {
            if (
                Object.prototype.hasOwnProperty.call(newState, key) &&
                Object.prototype.hasOwnProperty.call(this._state, key)
            ) {
                // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                // @ts-ignore
                this._state[key] = newState[key as keyof AddMIOHelperState];
            }
        }

        if (callback) {
            callback();
        }
        this.onStateChange();
    };

    exceedFileSize = (files: File[], thresholdSize: number): boolean => {
        const totalSize = files.reduce(
            (accum, current): number => accum + current.size,
            0
        );

        return totalSize > thresholdSize;
    };

    bigFile = (files: File[]): boolean => this.exceedFileSize(files, 1048576.0);
    tooBig = (files: File[]): boolean => this.exceedFileSize(files, 10485760.0);

    onSelect = (files: File[]): void => {
        const bigFile = this.bigFile(files);
        const tooBig = this.tooBig(files);

        this.setState(
            {
                files: files,
                bigFile: bigFile,
                tooBig: tooBig
            },
            this.parseFiles
        );
    };

    protected handleResult = (
        result: MIOParserResult | Error | MIOParserError | undefined,
        fileName: string,
        callback?: () => void
    ): void => {
        if (!result) {
            return;
        }
        // Result is a MIOParserError or Error that was thrown during parsing
        if (result instanceof Error) {
            const generalError = result as MIOParserError;
            this.setState({
                files: [],
                errorMessage: generalError.message,
                errorDetailMessage: generalError.details,
                errorDetailMessageToCopy: JSON.stringify({
                    errors: [generalError.details]
                }),
                hasError: true,
                numErrors: 1
            });
        }
        // Result is not an Error, but MIOParserResult
        else {
            // Validation Errors occurred
            if (result.errors.length) {
                const e = result.errors[0];
                const msg = `${e.message} (Ressource: ${e.resource}, Pfad: ${
                    e.path ? e.path : "-"
                }, Wert: ${e.value ? e.value : "- "})`;

                this.setState({
                    files: [],
                    errorMessage: "Der Inhalt des MIOs ist nicht valide.",
                    errorDetailMessage: msg,
                    errorDetailMessageToCopy: JSON.stringify({ errors: result.errors }),
                    hasError: true,
                    numErrors: result.errors.length
                });

                if (this.mioExists(result.value as KBVBundleResource)) {
                    if (callback) {
                        callback();
                    }
                }
            }
            // No Errors during validation
            else {
                const value = result.value as KBVBundleResource;

                // Single Profiles should not be able to load at the moment
                if (value.resourceType !== "Bundle") {
                    this.setState({
                        files: [],
                        errorMessage:
                            "Einzelne Profile können nicht geladen werden. Bitte wählen Sie ein Bundle aus.",
                        hasError: true,
                        numErrors: 1
                    });
                }
                // Resource is a bundle
                else {
                    if (!this.isDeprecated(value)) {
                        if (!this.mioExists(value)) {
                            this.props.mios.push(value);
                        }
                        if (callback) {
                            callback();
                        }
                    }
                }
            }
        }
    };

    protected mioExists(value: KBVBundleResource): boolean {
        return this.props.mios.some(
            (mio) => mio.identifier.value === value.identifier.value
        );
    }

    protected isDeprecated(value: KBVBundleResource): boolean {
        const deprecated = [
            {
                name: "Mutterpass",
                profile:
                    "https://fhir.kbv.de/StructureDefinition/KBV_PR_MIO_MR_Bundle|1.0.0",
                currentVersion: "1.1.0"
            }
        ];

        const deprecatedResult = deprecated.filter(
            (d) => d.profile === value.meta.profile[0]
        );

        const isDeprecated = deprecatedResult.length > 0;

        if (isDeprecated) {
            const result = deprecatedResult[0];
            const oldVersion = result.profile.split("|").pop();

            const msg = `Die Version ${oldVersion} des MIOs ${result.name} wird im MIO Viewer nicht mehr unterstützt. MIOs dieses Typs müssen in der Version ${result.currentVersion} vorliegen. Falls Sie diese Datei validieren wollen können Sie den <a href="https://mio-parser.kbv.de/" target="_blank" rel="noopener noreferrer">MIO Parser Web</a> benutzen.`;
            this.setState({
                files: [],
                errorMessage: msg,
                hasError: true,
                numErrors: 1
            });
        }

        return isDeprecated;
    }

    // handles the files that were put into the MIO Viewer
    protected parseFiles = (): void => {
        const lastCallback = this.onParseFiles;
        const files = this._state.files;
        if (this._state.tooBig) {
            const message =
                files.length > 1
                    ? "Die Gesamtgröße der Dateien ist zu groß. Bitte maximal 10MB hochladen."
                    : "Die Datei ist zu groß. Bitte maximal 10MB hochladen.";
            this.handleResult(new Error(message), "");
        } else {
            const handle = (
                results: MIOParserResult[] | Error | MIOParserError | undefined
            ) => {
                if (
                    results &&
                    (results instanceof Error || results instanceof MIOParserError)
                ) {
                    this.handleResult(results, files[0].name);
                } else {
                    if (results && results.length > 0) {
                        try {
                            results.forEach((r: MIOParserResult) => console.log(r));
                            const last = results.pop();
                            results.forEach((result: MIOParserResult) =>
                                this.handleResult(result, files[0].name)
                            );
                            this.handleResult(last, files[0].name, lastCallback);
                        } catch (e) {
                            // Unknown error
                            this.handleResult(e, files[0].name);
                        }
                    }
                }
            };

            this.props.setLoading(true).then(() => {
                if (typeof window.Worker !== "undefined") {
                    const worker = new ParseWorker();
                    const AddMIOWorker = Comlink.wrap(worker);
                    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                    // @ts-ignore
                    new AddMIOWorker(files);

                    worker.onmessage = (e) => {
                        let results = e.data;

                        // Try parse Error and GeneralError
                        try {
                            const parsed = JSON.parse(results);

                            if (parsed.message) {
                                results = new Error(parsed.message);

                                if (parsed.details) {
                                    results = new MIOParserError(
                                        parsed.fileName,
                                        parsed.message,
                                        parsed.details
                                    );
                                }
                            }
                        } catch (exception) {
                            // Nothing to do here
                        }

                        if (results.name !== "proxy") {
                            this.props.setLoading(false).then(() => handle(results));
                        }
                    };
                } else {
                    this.props
                        .parseMIOs(files)
                        .then((results) =>
                            this.props.setLoading(false).then(() => handle(results))
                        );
                }
            });
        }
    };

    protected renderErrorBox(): JSX.Element {
        const { errorMessage, errorDetailMessage, errorDetailMessageToCopy, numErrors } =
            this._state;

        purify.setConfig({ ADD_ATTR: ["target"] });

        return (
            <div className={"error-content"}>
                <div className={"texts"}>
                    <p>Beim Import des MIOs ist ein Fehler aufgetreten.</p>
                    <p
                        dangerouslySetInnerHTML={{
                            __html: purify.sanitize(errorMessage)
                        }}
                    />
                </div>
                {errorDetailMessage && (
                    <div className={"error-details"}>
                        <UI.ContentCopyBox
                            headline={"Fehlerdetails"}
                            content={errorDetailMessage}
                            contentToCopy={errorDetailMessageToCopy}
                        />
                        {numErrors > 1 && (
                            <div className={"count"}>
                                und {numErrors === 2 ? "ein" : numErrors - 1} weitere
                                {numErrors === 2 ? "r" : ""} Fehler.
                            </div>
                        )}
                    </div>
                )}
            </div>
        );
    }

    protected renderErrorModal(): JSX.Element {
        const { hasError } = this.state;
        return (
            <UI.Modal
                headline={"Fehler"}
                content={this.renderErrorBox()}
                show={hasError}
                onClose={() => this.setState({ hasError: false })}
            />
        );
    }

    protected renderLoadingAnimation(
        loading: boolean,
        id: string
    ): JSX.Element | undefined {
        const { files, bigFile } = this.state;

        if (loading && bigFile) {
            return (
                <UI.LoadingAnimation
                    id={"lottie-loading-" + id}
                    loadingText={
                        files.length > 1 ? "MIOs werden geladen" : "MIO wird geladen"
                    }
                />
            );
        }
    }

    public renderMain(loading: boolean, id: string): JSX.Element {
        return (
            <>
                {this.renderLoadingAnimation(loading, id)}
                {this.renderErrorModal()}
            </>
        );
    }
}
