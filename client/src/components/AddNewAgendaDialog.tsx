import React, { useState } from 'react'
import { Button } from "@/components/ui/button"
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";

import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useAgenda } from '@/context/AgendaContext';
import { TAgendaValueForm } from '@/helpers/agendaForm.helper';


type TAgendaValue = {
    title: TAgendaValueForm;
}

const AddNewAgendaDialog = () => {
    const initialAgendaValue: TAgendaValue = {
        title: {
            value: "",
            message: "Title field should not be empty.",
            isError: false,
            isRequired: true
        },
    }
    const [AgendaValue, setNewAgendaValue] = useState<TAgendaValue>(initialAgendaValue);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const { setNewAgenda } = useAgenda();

    const handleAgendaValueChange = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const name = event.target.name;
        if (name in AgendaValue) {
            const value = event.target.value;
            setNewAgendaValue({ ...AgendaValue, [name]: { ...AgendaValue[name as keyof TAgendaValue], value } });
        }
    }

    const handleAgendaValueSubmit = async (event: React.FormEvent) => {
        event.preventDefault();
        try {
            const hasError: boolean[] = [];
            const agendas = { ...AgendaValue };
            const values: { [key: string]: string | number | boolean } = {};
            for (const key in agendas) {
                const agenda = AgendaValue[key as keyof TAgendaValue];

                if (agenda.isRequired) {
                    if (!agenda.value) {
                        agenda.isError = true;
                        hasError.push(true);
                    }
                    else {
                        agenda.isError = false;
                    }
                }

                values[key] = agenda.value;
            }

            setNewAgendaValue(agendas);

            if (!hasError.length) {
                setNewAgenda(agendas.title.value);
                document.getElementById('closeDialog')?.click();
            }
        } catch (error) {
            setIsLoading(false);
            throw new Error;
        }
        finally {
            setIsLoading(false);
        }
    }

    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button>Create New Agenda</Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[380px]">
                <DialogHeader>
                    <DialogTitle>Create New Agenda</DialogTitle>
                    <DialogDescription>
                        Please fill up the field(s) to create new agenda.
                    </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                    <div className="grid w-full max-w-sm items-center gap-1.5">
                        <Label htmlFor="email">Title</Label>
                        <div className="" >
                            <Input id="title" name="title" value={AgendaValue.title.value} placeholder="Type your agenda title here." onChange={handleAgendaValueChange} disabled={isLoading} />
                            {
                                AgendaValue.title.isError ? (<p className="text-red-500 text-xs mt-1">{AgendaValue.title.message}</p>) : null
                            }
                        </div>
                    </div>
                </div>
                <DialogFooter>
                    <DialogClose asChild>
                        <Button type="button" variant="secondary" id="closeDialog">
                            Close
                        </Button>
                    </DialogClose>
                    <Button type="submit" onClick={handleAgendaValueSubmit} disabled={isLoading}>{isLoading ? "...loading" : "Add Agenda"}</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog >
    )
}

export default AddNewAgendaDialog



