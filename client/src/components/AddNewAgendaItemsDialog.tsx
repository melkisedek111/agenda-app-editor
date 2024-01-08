import React, { useState } from 'react'
import { Button } from "@/components/ui/button"
import { useToast } from "@/components/ui/use-toast"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import { useAgenda } from '@/context/AgendaContext';
import { TAgendaValues, handleAgendaCreditableChange, handleAgendaPhaseChange, handleAgendaValuesChange, handleNumericInputChange, initialAgendaItemValues } from '@/helpers/agendaForm.helper';


const AddNewAgendaItemsDialog = () => {

    const [agendaValues, setAgendaValues] = useState<TAgendaValues>(initialAgendaItemValues);
    const { newAgenda, selectedAgendaItems, setSelectedAgendaItems, setNewAgendaItems, newAgendaItems } = useAgenda();
    const { toast } = useToast();

    const handleAgendaValuesSubmit = async (event: React.FormEvent) => {
        event.preventDefault();
        try {
            const hasError: boolean[] = [];
            const agendas = { ...agendaValues };
            const values: any = {};
            for (const key in agendas) {
                const agenda = agendaValues[key as keyof TAgendaValues];

                if (agenda.isRequired) {
                    if (!agenda.value || agenda.value === 0) {
                        agenda.isError = true;
                        hasError.push(true);
                    } else if (key === "order") {
                        const findExistingOrder = selectedAgendaItems.filter(item => item.order == agenda.value);

                        if (findExistingOrder.length) {
                            agenda.isError = true;
                            agenda.message = "Order number is already exists!";
                            hasError.push(true);
                        } else {
                            agenda.isError = false;
                            agenda.message = "Order field should not be empty.";
                        }
                    }
                    else {
                        agenda.isError = false;
                    }
                }

                values[key] = agenda.value;
            }
            setAgendaValues(agendas);

            if (!hasError.length) {
                const newValues = [...selectedAgendaItems, values];
                const totalCreditableDuration = [...newValues].reduce((acc, curr) => acc += curr.creditable ? Number(curr.duration) : 0, 0);
                setSelectedAgendaItems(newValues);
                setNewAgendaItems([...newAgendaItems, values]);
                setAgendaValues(initialAgendaItemValues);
                toast({ description: "Your agenda item has been added." });

                if (totalCreditableDuration < 15) {
                    toast({ variant: "destructive", description: "Your total creditable duration is less than 15 minutes." });
                }
            }
        } catch (error) {
            console.log(error);
        }
    }

    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button id="openDialog">Add Agenda Item</Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[640px]">
                <DialogHeader>
                    <DialogTitle>Add New Agenda Item</DialogTitle>
                    <DialogDescription>
                        Please fill up the fields to create new agenda item.
                    </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="order" className="text-right">
                            Agenda Title
                        </Label>
                        <div className="col-span-3" >
                            <Input id="agendaTitle" name="agendaTitle" value={newAgenda} disabled={true} />
                        </div>
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="order" className="text-right">
                            Order
                        </Label>
                        <div className="col-span-3" >
                            <Input id="order" name="order" onKeyDown={handleNumericInputChange} value={agendaValues.order.value} placeholder="Type your agenda order here." onChange={(event) => handleAgendaValuesChange(event, agendaValues, setAgendaValues)} />
                            {
                                agendaValues.order.isError ? (<p className="text-red-500 text-xs mt-1">{agendaValues.order.message}</p>) : null
                            }
                        </div>
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="phase" className="text-right">
                            Phase
                        </Label>
                        <div className="col-span-3">
                            <Select name="phase" value={agendaValues.phase.value} defaultValue={agendaValues.phase.value} onValueChange={(value) => handleAgendaPhaseChange(value, agendaValues, setAgendaValues)} >
                                <SelectTrigger>
                                    <SelectValue placeholder="Select a phase here." />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectGroup>
                                        <SelectLabel>Phases</SelectLabel>
                                        <SelectItem value="welcome">Welcome</SelectItem>
                                        <SelectItem value="Discussion Items">Discussion Items</SelectItem>
                                        <SelectItem value="Break">Break</SelectItem>
                                        <SelectItem value="Action Items">Action Items</SelectItem>
                                        <SelectItem value="Conclusion">Conclusion</SelectItem>
                                    </SelectGroup>
                                </SelectContent>
                            </Select>
                            {
                                agendaValues.phase.isError ? (<p className="text-red-500 text-xs mt-1">{agendaValues.phase.message}</p>) : null
                            }
                        </div>
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="content" className="text-right">
                            Content
                        </Label>
                        <div className="col-span-3">
                            <Textarea placeholder="Type your content here." id="content" name="content" value={agendaValues.content.value} onChange={(event) => handleAgendaValuesChange(event, agendaValues, setAgendaValues)} />
                            {
                                agendaValues.content.isError ? (<p className="text-red-500 text-xs mt-1">{agendaValues.content.message}</p>) : null
                            }
                        </div>
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="objectives" className="text-right">
                            Objectives
                        </Label>
                        <div className="col-span-3">
                            <Textarea name="objectives" id="objectives" placeholder="Type your objectives here." rows={5} value={agendaValues.objectives.value} onChange={(event) => handleAgendaValuesChange(event, agendaValues, setAgendaValues)} />
                            {
                                agendaValues.objectives.isError ? (<p className="text-red-500 text-xs mt-1">{agendaValues.objectives.message}</p>) : null
                            }
                        </div>
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="duration" className="text-right">
                            Duration (min)
                        </Label>
                        <div className="col-span-3">
                            <Input id="duration" name="duration" value={agendaValues.duration.value} onKeyDown={handleNumericInputChange} onChange={(event) => handleAgendaValuesChange(event, agendaValues, setAgendaValues)} />
                            {
                                agendaValues.duration.isError ? (<p className="text-red-500 text-xs mt-1">{agendaValues.duration.message}</p>) : null
                            }
                        </div>

                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="creditable" className="text-right">
                            Creditable
                        </Label>
                        <div className="col-span-3">
                            <Checkbox id="creditable" name="creditable" checked={agendaValues.creditable.value} onCheckedChange={(value: boolean) => handleAgendaCreditableChange(value, agendaValues, setAgendaValues)} />
                            {
                                agendaValues.creditable.isError ? (<p className="text-red-500 text-xs mt-1">{agendaValues.creditable.message}</p>) : null
                            }
                        </div>
                    </div>
                </div>
                <DialogFooter>
                    <Button type="submit" onClick={handleAgendaValuesSubmit} >Add</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}

export default AddNewAgendaItemsDialog



