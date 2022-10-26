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

import { MR } from "@kbv/mioparser";
import * as Models from "../../models";
import { DetailMapping } from "../Comprehensive/Detail/Types";

export default class Mappings {
    static Basic: DetailMapping[] = [
        {
            profile: MR.V1_1_0.Profile.PatientMother,
            header: "Patient/-in",
            models: [Models.MP.Basic.PatientMotherModel, Models.AddressModel]
        },
        {
            profile: MR.V1_1_0.Profile.EncounterGeneral,
            header: "Details",
            models: [Models.MP.EncounterGeneralModel]
        }
    ];

    static StampInformation: DetailMapping[] = [
        {
            profile: MR.V1_1_0.Profile.Practitioner,
            header: "Behandelnde Person",
            models: [
                Models.MP.Basic.PractitionerModel,
                Models.AddressModel,
                Models.TelecomModel,
                Models.AdditionalCommentModel
            ]
        },
        {
            profile: MR.V1_1_0.Profile.Organization,
            header: "Details zur Einrichtung",
            models: [
                Models.MP.Basic.OrganizationModel,
                Models.AddressModel,
                Models.TelecomModel,
                Models.AdditionalCommentModel
            ]
        }
    ];

    static Appointments: DetailMapping[] = [
        {
            profile: MR.V1_1_0.Profile.AppointmentPregnancy,
            models: [Models.MP.AppointmentPregnancyModel, Models.MP.ParticipantsModel]
        },
        {
            profile: MR.V1_1_0.Profile.EncounterArrivalMaternityHospital,
            models: [Models.MP.EncounterArrivalMaternityHospitalModel]
        }
    ];

    static DateDetermination: DetailMapping[] = [
        {
            profile: MR.V1_1_0.Profile.ObservationCalculatedDeliveryDate,
            models: [Models.MP.Basic.ObservationModel],
            noHeadline: false
        },
        {
            profile: MR.V1_1_0.Profile.ObservationDateDeterminationChildbirth,
            models: [Models.MP.Basic.ObservationModel],
            noHeadline: false,
            customHeadline: "Ergänzende Angaben zur Terminbestimmung",
            noValue: true
        },
        {
            profile: MR.V1_1_0.Profile.ObservationDateOfConception,
            models: [Models.MP.Basic.ObservationModel],
            noHeadline: false
        },
        {
            profile: MR.V1_1_0.Profile.ObservationDeterminationOfPregnancy,
            models: [Models.MP.Basic.ObservationModel],
            noHeadline: false,
            customLabel: "Schwangerschaft liegt vor"
        },
        {
            profile: MR.V1_1_0.Profile.ObservationMenstrualCycle,
            models: [Models.MP.ObservationMenstrualCycleModel]
        }
    ];

    static Anamnesis: {
        Basic: DetailMapping[];
        Observations: DetailMapping[];
        CatalogueA: DetailMapping[];
    } = {
        Basic: [
            {
                profile: MR.V1_1_0.Profile.ClinicalImpressionInitialExamination,
                header: "Erste Vorsorge-Untersuchung",
                models: [Models.MP.Basic.ClinicalImpressionModel]
            },
            {
                profile: MR.V1_1_0.Profile.ObservationPregnancyRisk,
                models: [Models.MP.Basic.ObservationModel]
            },
            {
                profile: MR.V1_1_0.Profile.ObservationPreviousPregnancy,
                models: [Models.MP.Basic.ObservationModel],
                noHeadline: false,
                customLabel: "Jahr"
            }
        ],
        Observations: [
            {
                profile: MR.V1_1_0.Profile.ObservationAge,
                models: [Models.MP.Basic.ObservationModel]
            },
            {
                profile: MR.V1_1_0.Profile.ObservationBaselineWeightMother,
                models: [Models.MP.Basic.ObservationModel]
            },
            {
                profile: MR.V1_1_0.Profile.ObservationHeight,
                models: [Models.MP.Basic.ObservationModel]
            },
            {
                profile: MR.V1_1_0.Profile.ObservationGravida,
                models: [Models.MP.Basic.ObservationModel]
            },
            {
                profile: MR.V1_1_0.Profile.ObservationPara,
                models: [Models.MP.Basic.ObservationModel]
            }
        ],
        CatalogueA: [
            {
                profile: MR.V1_1_0.Profile.ObservationCatalogueA,
                models: [Models.MP.Basic.ObservationModel],
                codeConceptMaps: [MR.V1_1_0.ConceptMap.CatalogueAGerman],
                header: "Details",
                customLabel: "Wert"
            }
        ]
    };

    static SpecialFindings: { Observation: DetailMapping[]; Tests: DetailMapping[] } = {
        Observation: [
            {
                profile: MR.V1_1_0.Profile.ObservationSpecialFindings,
                models: [Models.MP.Basic.ObservationModel],
                customLabel: "Befund",
                codeConceptMaps: [MR.V1_1_0.ConceptMap.SpecialFindingsGerman],
                valueConceptMaps: [MR.V1_1_0.ConceptMap.SpecialFindingsGerman]
            }
        ],
        Tests: [
            {
                profile: MR.V1_1_0.Profile.ObservationoGTTPretest,
                models: [Models.MP.Basic.ObservationModel],
                noHeadline: false,
                customLabel: "Beurteilung",
                valueConceptMaps: [MR.V1_1_0.ConceptMap.oGTTPretestGerman]
            },
            {
                profile: MR.V1_1_0.Profile.ObservationoGTTDiagnosistest,
                models: [Models.MP.Basic.ObservationModel],
                noHeadline: false,
                customLabel: "Beurteilung",
                valueConceptMaps: [MR.V1_1_0.ConceptMap.oGTTDiagnosistestGerman]
            }
        ]
    };

    static Counselling: DetailMapping[] = [
        {
            profile: MR.V1_1_0.Profile.ProcedureCounselling,
            models: [Models.MP.ProcedureCounsellingModel]
        },
        {
            profile: MR.V1_1_0.Profile.ObservationHIVTestPerformed,
            models: [Models.MP.Basic.ObservationModel],
            noHeadline: false
        }
    ];

    static AntiDProphylaxis: DetailMapping[] = [
        {
            profile: MR.V1_1_0.Profile.ProcedureAntiDProphylaxis,
            models: [Models.MP.Basic.ProcedureBaseModel]
        }
    ];

    static LaboratoryExamination: {
        BloodGroups: DetailMapping[];
        Observations: DetailMapping[];
        ImmunizationStatus: DetailMapping[];
    } = {
        BloodGroups: [
            {
                profile: MR.V1_1_0.Profile.ObservationBloodGroupSerology,
                models: [Models.MP.ObservationBloodGroupSerologyModel]
            },
            {
                profile: MR.V1_1_0.Profile.ObservationBloodGroupSerologyFetus,
                models: [Models.MP.ObservationBloodGroupSerologyModel],
                valueConceptMaps: [MR.V1_1_0.ConceptMap.RhesusSystemFetusGerman]
            },
            {
                profile: MR.V1_1_0.Profile.ObservationOtherBloodGroupSystems,
                models: [Models.MP.Basic.ObservationModel],
                noHeadline: false
            }
        ],
        Observations: [
            {
                profile: MR.V1_1_0.Profile.ObservationExamination,
                models: [Models.MP.Basic.ObservationModel],
                noHeadline: false,
                codeConceptMaps: [
                    MR.V1_1_0.ConceptMap.ExaminationInterpretationGerman,
                    MR.V1_1_0.ConceptMap.ExaminationSnomedGerman,
                    MR.V1_1_0.ConceptMap.ExaminationLoincGerman
                ],
                valueConceptMaps: [
                    MR.V1_1_0.ConceptMap.ExaminationResultQualitativeGerman
                ]
            },
            {
                profile: MR.V1_1_0.Profile.ObservationExaminationMasked,
                models: [Models.MP.Basic.ObservationModel],
                noHeadline: false,
                codeConceptMaps: [],
                valueConceptMaps: []
            }
        ],
        ImmunizationStatus: [
            {
                profile: MR.V1_1_0.Profile.ObservationImmunizationStatus,
                models: [Models.MP.Basic.ObservationModel],
                noHeadline: false,
                customLabel: "Immunität anzunehmen",
                codeConceptMaps: [MR.V1_1_0.ConceptMap.ImmunizationStatusGerman]
            }
        ]
    };

    static Gravidogramm: { Basic: DetailMapping[]; Observations: DetailMapping[] } = {
        Basic: [
            {
                profile: MR.V1_1_0.Profile.ClinicalImpressionPregnancyChartEntry,
                models: [
                    Models.MP.Basic.ClinicalImpressionModel,
                    Models.MP.Basic.ClinicalImpressionInvestigationModel,
                    Models.MP.Basic.ClinicalImpressionFindingModel
                ]
            }
        ],
        Observations: [
            {
                profile: MR.V1_1_0.Profile.ObservationBloodPressure,
                models: [Models.MP.Basic.ObservationModel]
            },
            {
                profile: MR.V1_1_0.Profile.ObservationWeightMother,
                models: [Models.MP.Basic.ObservationModel]
            },
            {
                profile: MR.V1_1_0.Profile.ObservationFundusHeight,
                models: [Models.MP.Basic.ObservationModel]
            },
            {
                profile: MR.V1_1_0.Profile.ObservationVaricosis,
                models: [Models.MP.Basic.ObservationModel]
            },
            {
                profile: MR.V1_1_0.Profile.ObservationEdema,
                models: [Models.MP.Basic.ObservationModel]
            },
            {
                profile: MR.V1_1_0.Profile.ObservationUrine,
                models: [Models.MP.Basic.ObservationModel]
            },
            {
                profile: MR.V1_1_0.Profile.ObservationUrineSugar,
                models: [Models.MP.Basic.ObservationModel]
            },
            {
                profile: MR.V1_1_0.Profile.ObservationUrineProtein,
                models: [Models.MP.Basic.ObservationModel]
            },
            {
                profile: MR.V1_1_0.Profile.ObservationVaginalExamination,
                models: [Models.MP.Basic.ObservationModel]
            },
            {
                profile: MR.V1_1_0.Profile.ObservationHeartSoundsChild,
                models: [Models.MP.Basic.ObservationModel],
                codeConceptMaps: [MR.V1_1_0.ConceptMap.HeartSoundsChildGerman]
            },
            {
                profile: MR.V1_1_0.Profile.ObservationChildPosition,
                models: [Models.MP.Basic.ObservationModel],
                codeConceptMaps: [MR.V1_1_0.ConceptMap.ChildPositionGerman]
            },
            {
                profile: MR.V1_1_0.Profile.ObservationChildPositionAtBirth,
                models: [Models.MP.Basic.ObservationModel],
                codeConceptMaps: [MR.V1_1_0.ConceptMap.ChildPositionGerman]
            },
            {
                profile: MR.V1_1_0.Profile.ObservationChildMovement,
                models: [Models.MP.Basic.ObservationModel]
            }
        ]
    };

    static Cardiotocography: DetailMapping[] = [
        {
            profile: MR.V1_1_0.Profile.ObservationCardiotocography,
            noHeadline: false,
            customLabel: "Beurteilung",
            models: [Models.MP.Basic.ObservationModel]
        }
    ];

    static Ultrasound: {
        Comment: DetailMapping[];
        DiagnosticReports: DetailMapping[];
        Others: DetailMapping[];
        Observations: DetailMapping[];
    } = {
        Comment: [
            {
                profile: MR.V1_1_0.Profile.ObservationUltrasound,
                models: [Models.MP.Basic.ObservationModel],
                header: "Bemerkungen",
                noValue: true
            }
        ],
        DiagnosticReports: [
            {
                profile: MR.V1_1_0.Profile.DiagnosticReportUltrasoundI,
                header: "Ultraschall",
                models: [
                    Models.MP.Basic.ObservationModel,
                    Models.MP.DiagnosticReportResultModel,
                    Models.MP.DiagnosticReportResultRequireControlModel,
                    Models.AdditionalCommentModel
                ],
                noValue: true
            },
            {
                profile: MR.V1_1_0.Profile.DiagnosticReportUltrasoundII,
                header: "Ultraschall",
                models: [
                    Models.MP.Basic.ObservationModel,
                    Models.MP.DiagnosticReportResultModel,
                    Models.MP.DiagnosticReportResultRequireControlModel
                ],
                noValue: true
            },
            {
                profile: MR.V1_1_0.Profile.DiagnosticReportUltrasoundIII,
                header: "Ultraschall",
                models: [
                    Models.MP.Basic.ObservationModel,
                    Models.MP.DiagnosticReportResultModel,
                    Models.MP.DiagnosticReportResultRequireControlModel
                ],
                noValue: true
            }
        ],
        Others: [
            {
                profile: MR.V1_1_0.Profile.ObservationOtherUltrasoundStudies,
                models: [Models.MP.Basic.ObservationModel],
                header: "Weitere Ultraschall-Untersuchung",
                codeConceptMaps: [MR.V1_1_0.ConceptMap.OtherUltrasoundStudiesGerman]
            }
        ],
        Observations: [
            {
                profile: MR.V1_1_0.Profile.ObservationGeneralInformation,
                models: [Models.MP.Basic.ObservationModel],
                codeConceptMaps: [MR.V1_1_0.ConceptMap.GeneralInformationGerman]
            },
            {
                profile: MR.V1_1_0.Profile.ObservationPregnancyInformation,
                models: [Models.MP.Basic.ObservationModel],
                codeConceptMaps: [MR.V1_1_0.ConceptMap.PregnancyInformationGerman]
            },
            {
                profile: MR.V1_1_0.Profile.ObservationSingletonPregnancy,
                models: [Models.MP.Basic.ObservationModel]
            },
            {
                profile: MR.V1_1_0.Profile.ObservationHeartAction,
                models: [Models.MP.Basic.ObservationModel]
            },
            {
                profile: MR.V1_1_0.Profile.ObservationLocalisationPlacenta,
                models: [Models.MP.Basic.ObservationModel],
                valueConceptMaps: [MR.V1_1_0.ConceptMap.LocalisationPlacentaGerman]
            },
            {
                profile: MR.V1_1_0.Profile.ObservationBiometricsI,
                models: [Models.MP.Basic.ObservationModel],
                codeConceptMaps: [MR.V1_1_0.ConceptMap.BiometricsIGerman]
            },
            {
                profile: MR.V1_1_0.Profile.ObservationBiometricsII,
                models: [Models.MP.Basic.ObservationModel],
                codeConceptMaps: [MR.V1_1_0.ConceptMap.BiometricsIIIIIGerman]
            },
            {
                profile: MR.V1_1_0.Profile.ObservationBiometricsIII,
                models: [Models.MP.Basic.ObservationModel],
                codeConceptMaps: [MR.V1_1_0.ConceptMap.BiometricsIIIIIGerman]
            },
            {
                profile: MR.V1_1_0.Profile.ObservationPercentile,
                models: [Models.MP.Basic.ObservationModel]
            },
            {
                profile: MR.V1_1_0.Profile.ObservationTimelyDevelopment,
                models: [Models.MP.Basic.ObservationModel]
            },
            {
                profile: MR.V1_1_0.Profile.ObservationFindingsRequiredControl,
                models: [Models.MP.Basic.ObservationModel],
                codeConceptMaps: [MR.V1_1_0.ConceptMap.FindingsRequiredControlGerman]
            },
            {
                profile: MR.V1_1_0.Profile.ObservationAbnormalities,
                models: [Models.MP.Basic.ObservationModel]
            },
            {
                profile: MR.V1_1_0.Profile.ObservationConsultationInitiated,
                models: [Models.MP.Basic.ObservationModel]
            },
            {
                profile: MR.V1_1_0.Profile.ObservationMorphology,
                models: [Models.MP.Basic.ObservationModel],
                codeConceptMaps: [MR.V1_1_0.ConceptMap.MorphologyGerman]
            }
        ]
    };

    static EpicrisisPregnancy: {
        DischargeSummary: DetailMapping[];
        Observations: DetailMapping[];
    } = {
        DischargeSummary: [
            {
                profile:
                    MR.V1_1_0.Profile
                        .ClinicalImpressionPregnancyExaminationDischargeSummary,
                header: "Schwangerschaft",
                models: [
                    Models.MP.Basic.ClinicalImpressionModel,
                    Models.MP.Basic.ClinicalImpressionInvestigationModel,
                    Models.MP.Basic.ClinicalImpressionFindingModel
                ]
            }
        ],
        Observations: [
            {
                profile: MR.V1_1_0.Profile.ObservationPresentationAtBirthClinic,
                models: [Models.MP.Basic.ObservationModel]
            },
            {
                profile: MR.V1_1_0.Profile.ObservationInpatientStayDuringPregnancy,
                models: [Models.MP.Basic.ObservationModel]
            },
            {
                profile: MR.V1_1_0.Profile.ObservationNumberOfCheckups,
                models: [Models.MP.Basic.ObservationModel]
            }
        ]
    };

    static EpicrisisBirth: {
        DeliveryInformation: DetailMapping[];
        Child: DetailMapping[];
    } = {
        DeliveryInformation: [
            {
                profile:
                    MR.V1_1_0.Profile
                        .ClinicalImpressionBirthExaminationDeliveryInformation,
                header: "Geburt",
                models: [
                    Models.MP.Basic.ClinicalImpressionModel,
                    Models.MP.InformationAboutChildModelBirth
                ]
            }
        ],
        Child: [
            {
                header: "Angaben zum Kind",
                profile:
                    MR.V1_1_0.Profile.ClinicalImpressionBirthExaminationChildInformation,
                models: [
                    Models.MP.Basic.ClinicalImpressionModel,
                    Models.MP.Basic.ClinicalImpressionInvestigationModel
                ]
            },
            {
                profile: MR.V1_1_0.Profile.ObservationLiveBirth,
                models: [Models.MP.Basic.ObservationModel]
            },
            {
                profile: MR.V1_1_0.Profile.ObservationBirthMode,
                models: [Models.MP.Basic.ObservationModel],
                valueConceptMaps: [MR.V1_1_0.ConceptMap.BirthModeGerman]
            },
            {
                profile: MR.V1_1_0.Profile.ObservationWeightChild,
                models: [Models.MP.Basic.ObservationModel]
            },
            {
                profile: MR.V1_1_0.Profile.ObservationHeadCircumference,
                models: [Models.MP.Basic.ObservationModel]
            },
            {
                profile: MR.V1_1_0.Profile.ObservationBirthHeight,
                models: [Models.MP.Basic.ObservationModel]
            },
            {
                profile: MR.V1_1_0.Profile.ObservationApgarScore,
                models: [Models.MP.Basic.ObservationModel]
            },
            {
                profile: MR.V1_1_0.Profile.ObservationpHValueUmbilicalArtery,
                models: [Models.MP.Basic.ObservationModel]
            },
            {
                profile: MR.V1_1_0.Profile.ObservationMalformation,
                models: [Models.MP.Basic.ObservationModel]
            },
            {
                profile: MR.V1_1_0.Profile.ObservationExternalBirth,
                models: [Models.MP.Basic.ObservationModel]
            }
        ]
    };

    static EpicrisisFirstExamination: {
        ClinicalImpression: DetailMapping[];
        Mother: DetailMapping[];
        Child: DetailMapping[];
    } = {
        ClinicalImpression: [
            {
                profile:
                    MR.V1_1_0.Profile
                        .ClinicalImpressionFirstExaminationAfterChildbirthMother,
                models: [
                    Models.MP.Basic.ClinicalImpressionModel,
                    Models.MP.Basic.ClinicalImpressionInvestigationModel
                ],
                header: "Wochenbett"
            },
            {
                profile:
                    MR.V1_1_0.Profile
                        .ClinicalImpressionFirstExaminationAfterChildbirthChild,
                models: [
                    Models.MP.Basic.ClinicalImpressionModel,
                    Models.MP.Basic.ClinicalImpressionInvestigationModel
                ],
                header: "Wochenbett"
            }
        ],
        Mother: [
            {
                profile: MR.V1_1_0.Profile.ObservationPuerperiumNormal,
                models: [Models.MP.Basic.ObservationModel]
            },
            {
                profile: MR.V1_1_0.Profile.ObservationGynecologicalFindingNormal,
                models: [Models.MP.Basic.ObservationModel]
            },
            {
                profile: MR.V1_1_0.Profile.ObservationAntiDProphylaxisPostPartum,
                models: [Models.MP.Basic.ObservationModel]
            },
            {
                profile: MR.V1_1_0.Profile.ObservationAdviceOnIodineIntake,
                models: [Models.MP.Basic.ObservationModel]
            }
        ],
        Child: [
            {
                header: "Angaben zum Kind",
                profile: MR.V1_1_0.Profile.PatientChild,
                models: [Models.MP.Basic.PatientChildModel, Models.AdditionalCommentModel]
            },
            {
                profile: MR.V1_1_0.Profile.ObservationDirectCoombstest,
                models: [Models.MP.Basic.ObservationModel],
                valueConceptMaps: [MR.V1_1_0.ConceptMap.DirectCoombstestGerman]
            },
            {
                profile: MR.V1_1_0.Profile.ObservationBloodGroupSerologyChild,
                models: [Models.MP.Basic.ObservationModel]
            }
        ]
    };

    static EpicrisisSecondExamination: DetailMapping[] = [
        {
            profile: MR.V1_1_0.Profile.ClinicalImpressionSecondExaminationAfterChildbirth,
            models: [
                Models.MP.Basic.ClinicalImpressionModel,
                Models.MP.InformationAboutMotherModel,
                Models.MP.InformationAboutChildModel
            ],
            header: "Zweite Untersuchung nach Entbindung"
        },
        {
            profile: MR.V1_1_0.Profile.ObservationBreastfeedingBehavior,
            models: [Models.MP.Basic.ObservationModel],
            valueConceptMaps: [MR.V1_1_0.ConceptMap.BreastfeedingBehaviorGerman]
        },
        {
            profile: MR.V1_1_0.Profile.ObservationU3Performed,
            models: [Models.MP.Basic.ObservationModel]
        },
        {
            profile: MR.V1_1_0.Profile.ObservationChildIsHealthy,
            models: [Models.MP.Basic.ObservationModel]
        },
        {
            profile: MR.V1_1_0.Profile.ObservationNeedOfTreatmentU3,
            models: [Models.MP.Basic.ObservationModel]
        }
    ];

    static InpatientTreatment: DetailMapping[] = [
        {
            profile: MR.V1_1_0.Profile.EncounterInpatientTreatment,
            models: [Models.MP.EncounterInpatientTreatmentModel]
        }
    ];
}
