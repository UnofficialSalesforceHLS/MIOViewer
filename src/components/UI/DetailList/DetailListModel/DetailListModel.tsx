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
import { RouteComponentProps } from "react-router";
import { KBVBundleResource } from "@kbv/mioparser";
import DetailListStickyHeader, {
    DetailListStickyHeaderState
} from "../DetailListStickyHeader";

import { UI } from "../../../index";

import * as Models from "../../../../models/";
import { ModelValue } from "../../../../models/";

import "../DetailList.scss";

export type DetailListModelProps = {
    model: Models.Model;
    mio: KBVBundleResource;
    className?: string;
    appendItems?: ModelValue[];
};

export default abstract class DetailListModel extends DetailListStickyHeader<
    DetailListModelProps & RouteComponentProps,
    DetailListStickyHeaderState
> {
    protected constructor(props: DetailListModelProps & RouteComponentProps) {
        super(props);

        this.state = {
            stuck: false
        };
    }

    render(): JSX.Element {
        const { model, appendItems } = this.props;
        const headline = model.getHeadline();
        const values = model.getValues();
        if (appendItems) {
            values.push(...appendItems);
        }

        return (
            <DetailListStickyHeader className={"detail-list"}>
                {model.showHeadline() && (
                    <h5 className={"ion-padding ion-no-margin green sticky"}>
                        <div className={"inner"}>{headline}</div>
                    </h5>
                )}
                <div
                    className={
                        "ion-padding-bottom" +
                        (!model.showHeadline() ? " ion-padding-top" : "")
                    }
                >
                    {values.length ? (
                        values.map((part: ModelValue, index: number) => {
                            if (part.renderAs) {
                                const Component = part.renderAs;

                                return (
                                    <Component
                                        label={part.label}
                                        href={part.href}
                                        value={part.value}
                                        onClick={part.onClick}
                                        key={"item_" + index}
                                    />
                                );
                            } else {
                                return (
                                    <UI.ListItem.Basic
                                        label={part.label}
                                        value={part.value}
                                        onClick={part.onClick}
                                        key={"item_" + index}
                                    />
                                );
                            }
                        })
                    ) : (
                        <UI.ListItem.Hint
                            label={"Hinweis"}
                            value={`Unter „${headline}“ sind derzeit keine Inhalte vorhanden.`}
                        />
                    )}
                </div>
            </DetailListStickyHeader>
        );
    }
}
