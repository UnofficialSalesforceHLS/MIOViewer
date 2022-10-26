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

import * as Models from "../../../models";

import DetailComponent from "../../../components/Detail/Detail";
import DetailBase, { ListItemType } from "../../Comprehensive/Detail/DetailBase";
import { DetailMapping } from "../../Comprehensive/Detail/Types";

import { UI } from "../../../components";

import { MIOEntry, CMR } from "@kbv/mioparser";
import Mappings from "../Mappings";

class Detail extends DetailBase<
    | CMR.V1_0_1.Profile.CMRBundle
    | CMR.V1_0_1.Profile.PCBundle
    | CMR.V1_0_1.Profile.PNBundle
> {
    protected getHeaderClass(): UI.MIOClassName {
        return "uheft";
    }

    static mappings = Mappings.All;
    static mappingsObservation = Mappings.Observation;
    static mappingsDiagnosticReport = Mappings.DiagnosticReport;

    protected getMappings(): DetailMapping[] {
        return Detail.mappings;
    }

    protected mapResource = (): ListItemType | undefined => {
        const { mio, entry, history, location, match, devMode } = this.props;

        if (mio && entry) {
            const res = entry;
            const props = {
                mio: mio,
                entry: res.resource,
                history: history,
                location: location,
                match: match,
                devMode: devMode
            };

            let detailMappings = this.getMappings();

            const matchParams = match.params;
            if (matchParams.filter && matchParams.filterValue) {
                detailMappings = Mappings.Filterable;
            }

            const bundle = mio;
            let mappedResult!: ListItemType;

            detailMappings.forEach((mapping) => {
                if (!mappedResult && mapping.profile.is(res.resource)) {
                    const models = [];

                    if (mapping.models.length) {
                        mapping.models.forEach((model) => {
                            models.push(
                                new model(
                                    res.resource,
                                    res.fullUrl,
                                    bundle,
                                    history,
                                    mapping.codeConceptMaps,
                                    mapping.valueConceptMaps,
                                    mapping.customLabel,
                                    mapping.noValue,
                                    mapping.noHeadline,
                                    mapping.customHeadline
                                )
                            );
                        });
                    } else {
                        const model = new Models.UH.Basic.ObservationModel(
                            res.resource as Models.UH.Basic.ObservationType,
                            res.fullUrl,
                            bundle as CMR.V1_0_1.Profile.CMRBundle,
                            history,
                            mapping.codeConceptMaps,
                            mapping.valueConceptMaps,
                            mapping.customLabel,
                            mapping.noValue
                        );
                        models.push(model);
                    }

                    mappedResult = {
                        header: mapping.header ? mapping.header : "Details",
                        testIdSuffix: mapping.profile.name,
                        component: <DetailComponent {...props} models={[...models]} />
                    };
                }
            });
            return mappedResult;
        }
    };

    protected getPatient(): MIOEntry<CMR.V1_0_1.Profile.CMRPatient> | undefined {
        return undefined;
    }

    protected showPatient(): boolean {
        return false;
    }
}

export default Detail;
