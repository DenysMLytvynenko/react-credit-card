import { Field, useField } from "formik";
import {
    ChangeEvent,
    ClipboardEvent,
    FC,
    KeyboardEventHandler,
    useContext,
    useEffect,
} from "react";

import { fetchData } from "../../../api/fetchData";
import { BINCheckResponseTypes } from "../../../api/types";
import { CardContext } from "../../../context/CardContext";
import { ACTION_TYPES } from "../../../context/reducer";
import { fourDigits, onlyDigits } from "../../../utils/patterns";
import { CardNumberInputType } from "./types";

const CardNumberInput: FC<CardNumberInputType> = ({ cardNumberInputLabel }) => {
    const [{ value: value1 }, , { setValue: setValue1 }] =
        useField("cardNumber1");
    const [{ value: value2 }, , { setValue: setValue2 }] =
        useField("cardNumber2");
    const [{ value: value3 }, , { setValue: setValue3 }] =
        useField("cardNumber3");
    const [{ value: value4 }, , { setValue: setValue4 }] =
        useField("cardNumber4");

    const { dispatch } = useContext(CardContext);

    const BIN = value1 + value2;

    useEffect(() => {
        const controller = new AbortController();

        if (4 <= BIN.length && BIN.length <= 6) {
            fetchData<BINCheckResponseTypes>(
                "https://lookup.binlist.net/",
                BIN,
                controller.signal
            )
                .then((data) => {
                    console.log("Data", data.scheme);
                    if (data.scheme !== null) {
                        dispatch<string>({
                            type: ACTION_TYPES.CHANGE_PAYMENT_SYSTEM,
                            payload: data.scheme,
                        });
                    }
                })

                .catch((e) => console.error(e));
        }

        return () => controller.abort();
    }, [BIN, dispatch]);

    const cardNumberHandler = (
        event: ChangeEvent<HTMLInputElement>,
        setStateFunction: (value: string) => void
    ) => {
        const value = event.target.value;

        if (value.match(onlyDigits)) setStateFunction(value);
    };

    const cardNumber1Handler = (event: ChangeEvent<HTMLInputElement>) =>
        cardNumberHandler(event, setValue1);
    const cardNumber2Handler = (event: ChangeEvent<HTMLInputElement>) =>
        cardNumberHandler(event, setValue2);
    const cardNumber3Handler = (event: ChangeEvent<HTMLInputElement>) =>
        cardNumberHandler(event, setValue3);
    const cardNumber4Handler = (event: ChangeEvent<HTMLInputElement>) =>
        cardNumberHandler(event, setValue4);

    const handleOnPaste = (event: ClipboardEvent<HTMLInputElement>) => {
        const clipboardData = event.clipboardData.getData("text/plain");

        if (!clipboardData.match(onlyDigits)) return;

        const dividedClipboardData = clipboardData.match(fourDigits);

        if (dividedClipboardData !== null && dividedClipboardData.length > 1) {
            event.preventDefault();

            const cardNumberHandlers = [
                setValue1,
                setValue2,
                setValue3,
                setValue4,
            ];

            for (let index = 0; index < dividedClipboardData.length; index++) {
                cardNumberHandlers[index](dividedClipboardData[index]);
            }
        }
    };

    const handleKey: KeyboardEventHandler<HTMLInputElement> = (event) => {
        const input = event.currentTarget;

        const prev = input.previousSibling as HTMLInputElement | null;

        const next = input.nextSibling as HTMLInputElement | null;

        const key = event.key;

        switch (key) {
            case "ArrowLeft":
                if (input.selectionStart === 1 && input.selectionEnd === 1) {
                    if (prev) {
                        event.preventDefault();
                        prev.focus();
                        prev.selectionStart = prev.value.length;
                        prev.selectionEnd = prev.value.length;
                    }
                }
                break;

            case "ArrowRight":
                if (
                    input.selectionStart === input.value.length &&
                    input.selectionEnd === input.value.length
                ) {
                    if (next) {
                        event.preventDefault();
                        next.focus();
                        next.selectionStart = 1;
                        next.selectionEnd = 1;
                    }
                }
                break;

            default:
                if (
                    input.selectionStart === 4 &&
                    input.selectionEnd === 4 &&
                    key !== "Backspace"
                ) {
                    /**
                     * Focus next field if current is completed
                     */
                    if (next) {
                        next.focus();
                        next.selectionStart = 0;
                        next.selectionEnd = 0;
                    }
                }

                /**
                 * Focus on the previous field on card number deletion
                 */
                if (
                    input.selectionStart === 0 &&
                    input.selectionEnd === 0 &&
                    key === "Backspace"
                ) {
                    if (prev) {
                        prev.focus();
                        prev.selectionStart = prev.value.length;
                        prev.selectionEnd = prev.value.length;
                    }
                }
                break;
        }
    };

    return (
        <fieldset className="form-group">
            <legend>{cardNumberInputLabel}</legend>

            <label htmlFor="cc-1">{cardNumberInputLabel}</label>

            <div className="horizontal-input-stack">
                <Field
                    name="cardNumber1"
                    type="text"
                    id="cc-1"
                    aria-label="Credit card first 4 digits"
                    maxLength={4}
                    required
                    value={value1}
                    onChange={cardNumber1Handler}
                    onPaste={handleOnPaste}
                    onKeyDown={handleKey}
                />

                <Field
                    name="cardNumber2"
                    type="text"
                    id="cc-1"
                    aria-label="Credit card second 4 digits"
                    maxLength={4}
                    required
                    value={value2}
                    onChange={cardNumber2Handler}
                    onPaste={handleOnPaste}
                    onKeyDown={handleKey}
                />

                <Field
                    name="cardNumber3"
                    type="text"
                    id="cc-1"
                    aria-label="Credit card third 4 digits"
                    maxLength={4}
                    required
                    value={value3}
                    onChange={cardNumber3Handler}
                    onPaste={handleOnPaste}
                    onKeyDown={handleKey}
                />

                <Field
                    name="cardNumber4"
                    type="text"
                    id="cc-1"
                    aria-label="Credit card last 4 digits"
                    maxLength={4}
                    required
                    value={value4}
                    onChange={cardNumber4Handler}
                    onPaste={handleOnPaste}
                    onKeyDown={handleKey}
                />
            </div>
        </fieldset>
    );
};

export default CardNumberInput;
