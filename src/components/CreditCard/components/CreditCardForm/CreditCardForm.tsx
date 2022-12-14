import { Form, Formik, FormikErrors, FormikHelpers } from "formik";
import { FC } from "react";

import { CreditCardInitialValuesType, CreditCardProps } from "../../types";
import { spaces } from "../../utils/patterns";

// import CardAutoSubmit from "../CardAutoSubmit/CardAutoSubmit";
import CardBackground from "../CardBackground/CardBackground";
import CardHolderNameInput from "../CardHolderNameInput/CardHolderNameInput";
import CardLogo from "../CardLogo/CardLogo";
import CardNumberInput from "../CardNumberInput/CardNumberInput";
import CardSubmitButton from "../CardSubmitButton/CardSubmitButton";
import CcvCodeInput from "../CcvCodeInput/CcvCodeInput";
import Expiration from "../Expiration/Expiration";

const creditCardInitialValues: CreditCardInitialValuesType = {
    cardNumber1: "",
    cardNumber2: "",
    cardNumber3: "",
    cardNumber4: "",
    cardNumber: "",
    cardHolderName: "",
    expirationMonth: (new Date().getMonth() + 1).toString(),
    expirationYear: new Date().getFullYear().toString(),
    ccvCode: "",
};

const validateForm = (
    values: CreditCardInitialValuesType
): FormikErrors<CreditCardInitialValuesType> | undefined => {
    const {
        cardNumber1,
        cardNumber2,
        cardNumber3,
        cardNumber4,
        cardHolderName,
        ccvCode,
    } = values;

    let errors: FormikErrors<CreditCardInitialValuesType> = {};

    if (cardNumber1.length < 4) errors.cardNumber1 = "Must contain 4 digit";
    if (cardNumber2.length < 4) errors.cardNumber2 = "Must contain 4 digit";
    if (cardNumber3.length < 4) errors.cardNumber3 = "Must contain 4 digit";
    if (cardNumber4.length < 4) errors.cardNumber4 = "Must contain 4 digit";

    const cardNumberLength =
        cardNumber1.length +
        cardNumber2.length +
        cardNumber3.length +
        cardNumber4.length;

    if (cardNumberLength < 16) {
        errors.cardNumber = "Card number must contain 16 digits";
    }

    if (cardHolderName.replaceAll(spaces, "").trim().length < 3) {
        errors.cardHolderName =
            "Cardholder name must contain at least 3 characters";
    }

    if (cardHolderName.replaceAll(spaces, "").trim().length > 50) {
        errors.cardHolderName = "Cardholder name is too long";
    }

    if (ccvCode.length < 3) {
        errors.ccvCode = "Enter code";
    }

    return errors;
};

const CreditCardForm: FC<CreditCardProps> = ({
    bankName,
    onSubmit,
    // disableAutoSubmit,
    cardNumberInputLabel,
    cardHolderNameInputLabel,
    expirationDateLimitLabel,
    expirationDateLimit,
    ccvCodeInputLabel,
    frontCardAccentColor = "gold",
    isFrontCardSolidColor = false,
    frontCardCustomBG = "",
    backCardAccentColor = "gold",
    isBackCardSolidColor = true,
    backCardCustomBG = "",
    labelColor = "#ffffff",
    innerRef = null,
}) => {
    const submitForm = (
        values: CreditCardInitialValuesType,
        helpers: FormikHelpers<CreditCardInitialValuesType>
    ) => onSubmit(values, helpers);

    return (
        <Formik
            innerRef={innerRef}
            initialValues={creditCardInitialValues}
            validate={validateForm}
            onSubmit={submitForm}
        >
            {/* <CardAutoSubmit disableAutoSubmit={disableAutoSubmit}> */}
            <Form className="credit-card-form">
                <div className="credit-card" style={{ color: labelColor }}>
                    <div className="front">
                        <CardBackground
                            accentColor={frontCardAccentColor}
                            solid={isFrontCardSolidColor}
                            customBG={frontCardCustomBG}
                        />
                        <div className="card-data-row">
                            <div className="brand-name">{bankName}</div>
                            <CardLogo />
                        </div>
                        <CardNumberInput
                            cardNumberInputLabel={cardNumberInputLabel}
                        />
                        <div className="input-row">
                            <CardHolderNameInput
                                cardHolderNameInputLabel={
                                    cardHolderNameInputLabel
                                }
                            />
                            <Expiration
                                expirationDateLimitLabel={
                                    expirationDateLimitLabel
                                }
                                expirationDateLimit={expirationDateLimit}
                            />
                        </div>
                    </div>

                    <div className="back">
                        <CardBackground
                            accentColor={backCardAccentColor}
                            solid={isBackCardSolidColor}
                            customBG={backCardCustomBG}
                        />
                        <div className="stripe" />
                        <CcvCodeInput ccvCodeInputLabel={ccvCodeInputLabel} />
                    </div>
                </div>

                <CardSubmitButton />
            </Form>
            {/* </CardAutoSubmit> */}
        </Formik>
    );
};

export default CreditCardForm;
