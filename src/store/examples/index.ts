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

import { KBVBundleResource, ParserUtil } from "@kbv/mioparser";

// Example files to import
import IMExample_1_1_0 from "./IM/Example_IM_1_1_0.json";
import ZBExample_1_1_0 from "./ZB/Example_ZB_1_1_0.json";
import MPExample_1_1_0 from "./MP/Example_MR_1_1_0.json";
import UHExample_1_0_1_U2 from "./UH/1_0_1/KBV_PR_MIO_CMR_Bundle_U2.json";
import UHExample_1_0_1_U3 from "./UH/1_0_1/KBV_PR_MIO_CMR_Bundle_U3.json";
import UHExample_1_0_1_U9 from "./UH/1_0_1/KBV_PR_MIO_CMR_Bundle_U9.json";
import UHExample_1_0_1_PC from "./UH/1_0_1/KBV_PR_MIO_CMR_Bundle_PC.json";
import UHExample_1_0_1_PN from "./UH/1_0_1/KBV_PR_MIO_CMR_Bundle_PN.json";

import PKExample_1_0_0_DPE_Gewebe_Organspendeerklaerung from "./PK/Example_PKA_1_0_0_DPE_Gewebe_Organspendeerklaerung.json";
import PKExample_1_0_0_DPE_Patientenverfuegung from "./PK/Example_PKA_1_0_0_DPE_Patientenverfuegung.json";
import PKExample_1_0_0_DPE_Vorsorgevollmacht from "./PK/Example_PKA_1_0_0_DPE_Vorsorgevollmacht.json";
import PKExample_1_0_0_NFD from "./PK/Example_PKA_1_0_0_NFD.json";

// A bundle uuid starts with 8 chars 'example' has 7 - should be unique
const EXAMPLE_PREFIX = "example-";

const exampleFiles = [
    IMExample_1_1_0,
    ZBExample_1_1_0,
    MPExample_1_1_0,
    UHExample_1_0_1_U2,
    UHExample_1_0_1_U3,
    UHExample_1_0_1_U9,
    UHExample_1_0_1_PC,
    UHExample_1_0_1_PN,

    PKExample_1_0_0_DPE_Gewebe_Organspendeerklaerung,
    PKExample_1_0_0_DPE_Patientenverfuegung,
    PKExample_1_0_0_DPE_Vorsorgevollmacht,
    PKExample_1_0_0_NFD
];

const Examples = exampleFiles.map((e) => {
    e.identifier.value =
        EXAMPLE_PREFIX + ParserUtil.getUuidFromBundle(e as KBVBundleResource);
    return e as KBVBundleResource;
});

export { EXAMPLE_PREFIX };
export default Examples;
