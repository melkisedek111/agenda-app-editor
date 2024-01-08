export type TAgendaValueForm<T = string> = {
    value: T;
    message: string;
    isError: boolean;
    isRequired: boolean;
}

export type TAgendaValues = {
    _id: TAgendaValueForm;
    order: TAgendaValueForm<number>;
    phase: TAgendaValueForm;
    content: TAgendaValueForm;
    objectives: TAgendaValueForm;
    duration: TAgendaValueForm<number>;
    creditable: TAgendaValueForm<boolean>;
}

export const initialAgendaItemValues: TAgendaValues = {
    _id: {
        value: "",
        message: "",
        isError: false,
        isRequired: false
    },
    order: {
        value: 0,
        message: "Order field should not be empty.",
        isError: false,
        isRequired: true
    },
    phase: {
        value: "",
        message: "Phase field should not be empty.",
        isError: false,
        isRequired: true
    },
    content: {
        value: "",
        message: "Content field is required and should not be empty",
        isError: false,
        isRequired: false
    },
    objectives: {
        value: "",
        message: "",
        isError: false,
        isRequired: false
    },
    duration: {
        value: 0,
        message: "Duration field is required should not be empty.",
        isError: false,
        isRequired: false
    },
    creditable: {
        value: false,
        message: "",
        isError: false,
        isRequired: false
    },
}

export const handleAgendaValuesChange = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>, agendaValues: TAgendaValues, setAgendaValues: React.Dispatch<React.SetStateAction<TAgendaValues>>) => {
    const name = event.target.name;
    if (name in agendaValues) {
        const value = event.target.value;
        setAgendaValues({ ...agendaValues, [name]: { ...agendaValues[name as keyof TAgendaValues], value } });
    }
}

export const handleAgendaPhaseChange = (value: string, agendaValues: TAgendaValues, setAgendaValues: React.Dispatch<React.SetStateAction<TAgendaValues>>) => {
    setAgendaValues({ ...agendaValues, phase: { ...agendaValues.phase, value } });
}

export const handleAgendaCreditableChange = (value: boolean, agendaValues: TAgendaValues, setAgendaValues: React.Dispatch<React.SetStateAction<TAgendaValues>>) => {
    setAgendaValues({ ...agendaValues, creditable: { ...agendaValues.creditable, value }, duration: {...agendaValues.duration, isRequired: value}, content: { ...agendaValues.content, isRequired: value} });
}

export const handleNumericInputChange = (event: React.KeyboardEvent<HTMLInputElement>) => {
    const keyCode = event.keyCode || event.which;
    const keyValue = String.fromCharCode(keyCode);

    // Allow only numbers (0-9) and specific control keys like backspace, delete, arrows, etc.
    const allowedKeys = /[0-9\b]/;

    if (!allowedKeys.test(keyValue)) {
        event.preventDefault();
    }
}