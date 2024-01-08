import React from 'react'
import { Button } from "@/components/ui/button"
import moment from 'moment';

import {
    Card,
    CardContent,
    CardFooter,
} from "@/components/ui/card"
import { fetchApi } from '@/utils/fetch.util';
import { useAgenda } from '@/context/AgendaContext';

type TAgenda = {
    _id: string;
    title: string;
    date: string;
}

const AgendaCard: React.FC<TAgenda> = ({ _id, title, date }) => {
    const { setNewAgenda, setSelectedAgendaItems, setCurrentAgendaItems, setSelectedAgendaId, setLoading } = useAgenda();

    const handleGetAgendaItems = async (agendaId: string) => {
        try {
            setLoading(true);
            const request = await fetchApi("/agenda/items", {
                method: "POST",
                body: JSON.stringify({ agendaId })
            })

            const response = await request.json();

            if (request.ok) {
                const { data, status } = response;
                if (status) {
                    setNewAgenda(title);
                    setSelectedAgendaId(agendaId);
                    setSelectedAgendaItems(data);
                    setCurrentAgendaItems([...data]);
                }
            }
        } catch (error) {
            console.log(error);
        } finally {
            setTimeout(() => { setLoading(false) }, 2000)
        }
    }
    return (
        <Card className="w-[350px]">
            <CardContent className="mt-5">
                <h2 className="mt-10 scroll-m-20 text-3xl font-semibold tracking-tight transition-colors first:mt-0">
                    {title}
                </h2>
                <p className="leading-7 mt-2">
                    Created At: {moment(date).format('MMMM Do YYYY, h:mm:ss a')}
                </p>
            </CardContent>
            <CardFooter className="flex justify-between">
                <Button onClick={() => handleGetAgendaItems(_id)}>View</Button>
            </CardFooter>
        </Card>
    )
}

export default AgendaCard
