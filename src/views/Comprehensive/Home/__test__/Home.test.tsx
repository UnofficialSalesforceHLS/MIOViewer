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

import fs from "fs";
import { fireEvent, waitFor } from "@testing-library/react";

import * as ViewerTestUtil from "../../../../../test/TestUtil.test";
import * as TestUtil from "@kbv/miotestdata";

import Home from "../";

describe("<Home />", () => {
    ViewerTestUtil.mock();

    it("Rendert", async () => {
        const store = ViewerTestUtil.createStoreWithMios([]);
        const { getByTestId } = ViewerTestUtil.renderReduxRoute(
            Home,
            store,
            "/main",
            "/main"
        );

        expect(getByTestId("header-headline")).toHaveTextContent("Herzlich Willkommen");
        expect(getByTestId("intro-text")).toBeDefined();
        expect(getByTestId("input-file")).toBeDefined();
        expect(getByTestId("input-type-file")).toBeDefined();
    });

    type TestValue = {
        version?: string;
    } & TestUtil.MIOType;

    const bundles: TestValue[] = [
        { mio: "IM" },
        { mio: "ZB" },
        { mio: "MR", version: "1.1.0" },
        { mio: "UH" }
    ];

    const storeTest = (file: string, value: TestValue, version?: string) => {
        if (value.version && value.version !== version) return;
        it(file, async () => {
            const store = ViewerTestUtil.createStoreWithMios([]);
            const { getByTestId } = ViewerTestUtil.renderReduxRoute(
                Home,
                store,
                "/main",
                "/main"
            );

            const event = {
                target: {
                    files: [new File([fs.readFileSync(file)], "test.file")]
                }
            };

            fireEvent.change(getByTestId("input-type-file"), event);

            await waitFor(
                () => {
                    const state = store.getState().mioState;
                    expect(state.mios.length).toBe(1);
                },
                { timeout: 10000, interval: 500 }
            );
        });
    };

    TestUtil.runAllFiles(
        "Parsed ein MIO und fügt es dem Store hinzu",
        bundles,
        storeTest,
        "Bundles",
        true,
        ViewerTestUtil.mock
    );
});
