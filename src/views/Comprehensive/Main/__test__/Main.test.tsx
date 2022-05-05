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

import * as ViewerTestUtil from "../../../../../test/TestUtil.test";
import * as TestUtil from "@kbv/miotestdata";

import MIOParser, { KBVBundleResource } from "@kbv/mioparser";

import Main from "../";

describe("<Main />", () => {
    ViewerTestUtil.mock();
    const mioParser = new MIOParser();

    type TestValue = {
        version?: string;
    } & TestUtil.MIOType;

    const testValues: TestValue[] = [
        { mio: "IM" },
        { mio: "ZB" },
        { mio: "MR", version: "1.1.0" },
        { mio: "UH" }
    ];

    it("Rendert", async () => {
        const file = TestUtil.getExample(
            "/data/bundles/IM/1.1.0/IM_Ludger_Koenigsstein.json"
        );
        expect(file).toBeDefined();
        if (file) {
            const result = await mioParser.parseString(file);
            const bundle = result.value as KBVBundleResource;
            const store = ViewerTestUtil.createStoreWithMios([bundle]);

            const { getByTestId, getAllByText } = ViewerTestUtil.renderReduxRoute(
                Main,
                store,
                "/main",
                "/main"
            );

            expect(getByTestId("main-view")).toBeDefined();
            expect(getAllByText("Meine MIOs").length).toBe(2);

            expect(getByTestId("slide-0")).toBeDefined();

            expect(getAllByText("Impfpass").length).toBe(1);
        }
    });

    const renderTest = (bundles: string[], value: TestValue, version?: string) => {
        if (value.version && value.version !== version) return;
        it("mehrere Slider-Seiten", async () => {
            const mios: KBVBundleResource[] = [];
            for (let i = 0; i < bundles.length; i++) {
                const file = bundles[i];
                const blob = new File([fs.readFileSync(file)], "test.file");
                const result = await mioParser.parseFile(blob);
                mios.push(result.value as KBVBundleResource);
            }

            const store = ViewerTestUtil.createStoreWithMios([...mios]);

            const container = ViewerTestUtil.renderReduxRoute(
                Main,
                store,
                "/main",
                "/main"
            );

            expect(container.getByTestId("slide-0")).toBeDefined();
            expect(container.getByTestId("input-type-file")).toBeDefined();

            const max = Math.floor(bundles.length / 9);

            // U-Heft is grouped folder
            if (value.mio !== "UH") {
                expect(container.getByTestId(`slide-${max}`)).toBeDefined();
            }

            let text;
            if (value.mio === "IM") {
                text = "Impfpass";
            } else if (value.mio === "ZB") {
                text = "Zahnärztliches Bonusheft";
            } else if (value.mio === "MR") {
                text = "Mutterpass";
            } else if (value.mio === "UH") {
                text = "Kinderuntersuchungsheft";
            }

            if (text) {
                expect(container.getAllByText(text).length).toBeGreaterThan(0);
            }
        }, 50000);
    };

    TestUtil.runAll(
        "Rendert",
        testValues,
        renderTest,
        "Bundles",
        true,
        ViewerTestUtil.mock
    );
});
