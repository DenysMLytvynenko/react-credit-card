import { Field, Form, Formik, FormikHelpers } from "formik";
import { FC, useMemo } from "react";

import { CreditCardInitialValuesType, CreditCardProps } from "./types";

import CardNumberInput from "../CardNumberInput/CardNumberInput";

import mastercard from "images/mastercard.svg";
import visa from "images/visa.svg";

import styles from "./CreditCard.module.scss";

const creditCardInitialValues: CreditCardInitialValuesType = {
    cardNumber1: "",
    cardNumber2: "",
    cardNumber3: "",
    cardNumber4: "",
    cardHolderName: "",
    expirationMonth: "",
    expirationYear: "",
    ccvCode: "",
};

const CreditCard: FC<CreditCardProps> = ({
    bankName,
    paymentSystem,
    cardNumberInputLabel = "Card number",
    expirationDateLimit = 3,
}) => {
    /**
     * Depending from payment system shows appropriate emblem in the top right corner of the card.
     */
    const paymentSystemIcon = useMemo(
        () => (paymentSystem === "visa" ? visa : mastercard),
        [paymentSystem]
    );

    /**
     * Calculates options for the expiration year select field starting from current year and to the expiration date limit.
     */
    const yearsOptions = useMemo(() => {
        let options: JSX.Element[] = [];

        const currentYear = new Date().getFullYear();

        for (let i = currentYear; i < currentYear + expirationDateLimit; i++) {
            options.push(
                <option value={i} key={i}>
                    {i}
                </option>
            );
        }

        return options;
    }, [expirationDateLimit]);

    const submitForm = (
        values: CreditCardInitialValuesType,
        helpers: FormikHelpers<CreditCardInitialValuesType>
    ) => {
        console.log("Form values", values);
        console.log("Form helpers", helpers);
    };

    return (
        <Formik initialValues={creditCardInitialValues} onSubmit={submitForm}>
            <Form className={styles["credit-card"]}>
                <div className={styles.front}>
                    <div className={styles["card-data-row"]}>
                        <div className={styles["brand-name"]}>{bankName}</div>

                        <img
                            src={paymentSystemIcon}
                            alt="paymentSystemIcon"
                            className={styles.logo}
                        />
                    </div>

                    <CardNumberInput
                        cardNumberInputLabel={cardNumberInputLabel}
                    />

                    <div className={styles["input-row"]}>
                        <div
                            className={`${styles["form-group"]} ${styles["name-group"]} `}
                        >
                            <label htmlFor="name">Name</label>

                            <Field
                                name="cardHolderName"
                                type="text"
                                id="name"
                                required
                            />
                        </div>

                        <fieldset className={`${styles["form-group"]}`}>
                            <legend>Expiration</legend>

                            <label htmlFor="expiration-month">Expiration</label>

                            <div className={styles["horizontal-input-stack"]}>
                                <Field
                                    name="expirationMonth"
                                    as="select"
                                    id="expiration-month"
                                    aria-label="Expiration Month"
                                    required
                                >
                                    <option value="01">01</option>
                                    <option value="02">02</option>
                                    <option value="03">03</option>
                                    <option value="04">04</option>
                                    <option value="05">05</option>
                                    <option value="06">06</option>
                                    <option value="07">07</option>
                                    <option value="08">08</option>
                                    <option value="09">09</option>
                                    <option value="10">10</option>
                                    <option value="11">11</option>
                                    <option value="12">12</option>
                                </Field>

                                <Field
                                    name="expirationYear"
                                    as="select"
                                    id="expiration-year"
                                    aria-label="Expiration year"
                                    required
                                >
                                    {yearsOptions}
                                </Field>
                            </div>
                        </fieldset>
                    </div>
                </div>

                <div className={styles["back"]}>
                    <div className={styles["stripe"]} />

                    <div
                        className={`${styles["form-group"]} ${styles["ccv-group"]}`}
                    >
                        <label htmlFor="ccv">ccv</label>

                        <Field
                            name="ccvCode"
                            type="text"
                            maxLength={3}
                            id="ccv"
                            className={styles["ccv-input"]}
                            required
                        />
                    </div>
                </div>

                <button type="submit">submit</button>
            </Form>
        </Formik>
    );
};

export default CreditCard;
