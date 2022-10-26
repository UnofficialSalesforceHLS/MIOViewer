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

import * as ViewerTestUtil from "../../../../TestUtil";
import * as TestUtil from "@kbv/miotestdata";

import * as Info from "../";

describe("<Info />", () => {
    ViewerTestUtil.mock();

    const renderTest = (file: string) => {
        it(file, async () => {
            const { getByText } = await ViewerTestUtil.renderRoute(
                Info.Info,
                "/info",
                "/info"
            );
            expect(getByText("Hilfethemen")).toBeDefined();
        });
    };

    TestUtil.runAllBundleFiles("Rendert", renderTest, false);
});
