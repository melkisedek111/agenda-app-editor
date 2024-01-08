import React, { useEffect, useState } from 'react'
import spinner from "@/assets/spinner.svg";
import { AgendaItemsTable } from './AgendaTable'
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { Button } from './ui/button'
import AddNewAgendaDialog from './AddNewAgendaDialog'
import AgendaCard from './AgendaCard'
import { useAgenda } from '@/context/AgendaContext'
import { ChevronLeftIcon } from '@radix-ui/react-icons'
import AddNewAgendaItemsDialog from './AddNewAgendaItemsDialog'
import { fetchApi } from '@/utils/fetch.util'
import { useToast } from "@/components/ui/use-toast"
import UpdateAgendaItemsDialog from './UpdateAgendaItemsDialog'

const LoadingSpinner = () => <div className="flex justify-center items-center">
    <img src={spinner} alt="logo" />
</div>;

const Agenda = () => {
    const { newAgenda, setNewAgenda, selectedAgendaItems, setSelectedAgendaItems, setNewAgendaItems, isToUpdate, setCurrentAgendaItems, currentAgendaItems, setSelectedAgendaId, selectedAgendaId, setLoading, loading } = useAgenda();
    const [agendas, setAgendas] = useState([]);
    const { toast } = useToast()

    const getAgendas = async () => {
        try {
            setLoading(true);
            const request = await fetchApi("/agenda/get", {
                method: "GET",
            })
            const response = await request.json();
            if (request.ok) {
                const { data, status } = response;
                if (status) {
                    setAgendas(data)
                }
            }
        } catch (error) {
            console.log(error);
        } finally {
            setTimeout(() => { setLoading(false) }, 2000)
        }
    }

    const handleRemoveNewAgenda = () => {
        getAgendas();
        setNewAgenda("");
        setSelectedAgendaItems([]);
        setNewAgendaItems([]);
        setCurrentAgendaItems([]);
        setSelectedAgendaId("");
    }

    const handleCancelChanges = () => {
        setSelectedAgendaItems([...currentAgendaItems])
    }

    const handleSaveAgenda = async (event: React.FormEvent) => {
        event.preventDefault();
        try {
            if (newAgenda && selectedAgendaItems.length) {
                const request = await fetchApi("/agenda/createUpdateDeleteAgendaItem", {
                    method: "POST",
                    body: JSON.stringify({
                        title: newAgenda,
                        items: selectedAgendaItems,
                        agendaId: selectedAgendaId
                    })
                })

                if (request.ok) {
                    const response = await request.json();
                    if (response.status === 200) {
                        if (response.data.isSuccess) {
                            setSelectedAgendaItems(response.data.data)
                            setCurrentAgendaItems(response.data.data)
                            toast({ description: "Your agenda items is successfully saved." })
                        }
                    }
                }
            }
        } catch (error) {
            console.log(error)
        }
    }

    useEffect(() => {
        getAgendas();
    }, [])

    return (
        <div>
            <Card className="">
                <CardHeader>
                    <CardTitle>
                        {
                            newAgenda || selectedAgendaItems.length ? <>
                                <Button className="mb-5 flex justify-between" onClick={handleRemoveNewAgenda}>
                                    <ChevronLeftIcon /> Back
                                </Button>
                                <div className="flex justify-between">
                                    <h2 className="mt-10 scroll-m-20  text-3xl font-semibold tracking-tight transition-colors first:mt-0">
                                        Agenda Items for {newAgenda}
                                    </h2>
                                    <AddNewAgendaItemsDialog />
                                </div>
                            </> : <div className="flex justify-between">
                                <h2 className="mt-10 scroll-m-20  text-3xl font-semibold tracking-tight transition-colors first:mt-0">
                                    Agenda(s)
                                </h2>
                                <AddNewAgendaDialog />
                            </div>
                        }
                    </CardTitle>
                    <CardDescription>List of the current agenda(s)</CardDescription>
                </CardHeader>
                <CardContent>
                    {
                        loading ? <LoadingSpinner /> : <>
                            {
                                newAgenda || selectedAgendaItems.length ? <>
                                    <AgendaItemsTable />
                                    <UpdateAgendaItemsDialog />
                                </> : <div className="flex gap-2">
                                    {agendas.map((item: any) => <AgendaCard key={item._id} _id={item._id} title={item.title} date={item.createdAt} />)}
                                </div>
                            }
                        </>
                    }

                    {
                        isToUpdate ?
                            <div>
                                <p className="text-sm text-center mb-5 text-muted-foreground text-yellow-500">There are some change(s) on your agenda items.</p>
                                <div className="flex justify-center gap-4 items-center">
                                    <Button variant="secondary" onClick={handleCancelChanges}>
                                        Cancel
                                    </Button>
                                    <Button onClick={handleSaveAgenda}>
                                        Save
                                    </Button>

                                </div>
                            </div>
                            : null
                    }
                </CardContent>
            </Card>
        </div>
    )
}

export default Agenda