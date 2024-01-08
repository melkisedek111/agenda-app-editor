import { TAgendaItem } from '@/components/AgendaTable';
import { fetchApi } from '@/utils/fetch.util';
import React, { createContext, useState, useContext, ReactNode } from 'react';


export type TAgenda = {
    _id: string;
    title: string;
    createdAt: string;
    updatedAt: string;
}

export type TAgendaContext = {
    loading: boolean;
    setLoading: React.Dispatch<React.SetStateAction<boolean>>;
    newAgenda: string;
    selectedAgendaId: string;
    setSelectedAgendaId: React.Dispatch<React.SetStateAction<string>>;
    setNewAgenda: React.Dispatch<React.SetStateAction<string>>;
    agendaList: TAgenda[],
    setAgendaList: React.Dispatch<React.SetStateAction<TAgenda[]>>;
    selectedAgendaItems: TAgendaItem[];
    setSelectedAgendaItems: React.Dispatch<React.SetStateAction<TAgendaItem[]>>;
    setNewAgendaItems: React.Dispatch<React.SetStateAction<TAgendaItem[]>>;
    newAgendaItems: TAgendaItem[];
    currentAgendaItems: TAgendaItem[];
    setCurrentAgendaItems: React.Dispatch<React.SetStateAction<TAgendaItem[]>>;
    isToUpdate: boolean;
    selectedAgendaItem: TAgendaItem | undefined;
    setSelectedAgendaItem:React.Dispatch<React.SetStateAction<TAgendaItem | undefined>>;
}

const AgendaContext = createContext<TAgendaContext | undefined>(undefined)

export const useAgenda = () => {
    const context = useContext<TAgendaContext | undefined>(AgendaContext);
    if (!context) {
        throw new Error('useTheme must be used within a AgendaProvider');
    }
    return context;
}

type AgendaProviderProps = {
    children: ReactNode;
};


export const AgendaProvider: React.FC<AgendaProviderProps> = ({ children }) => {
    const [agendaList, setAgendaList] = useState<TAgenda[]>([]);
    const [selectedAgendaItems, setSelectedAgendaItems] = useState<TAgendaItem[]>([]);
    const [currentAgendaItems, setCurrentAgendaItems] = useState<TAgendaItem[]>([]);
    const [newAgendaItems, setNewAgendaItems] = useState<TAgendaItem[]>([]);
    const [newAgenda, setNewAgenda] = useState<string>("");
    const [selectedAgendaId, setSelectedAgendaId] = useState<string>("");
    const [loading, setLoading] = useState<boolean>(false);
    const [selectedAgendaItem, setSelectedAgendaItem] = useState<TAgendaItem | undefined>(undefined);

    const isToUpdate = JSON.stringify(currentAgendaItems) !== JSON.stringify(selectedAgendaItems);

    const contextValue: TAgendaContext = {
        agendaList, setAgendaList, newAgenda, setNewAgenda, selectedAgendaItems, setSelectedAgendaItems, setNewAgendaItems,
        newAgendaItems, currentAgendaItems, setCurrentAgendaItems, isToUpdate, selectedAgendaId, setSelectedAgendaId, selectedAgendaItem, setSelectedAgendaItem, loading, setLoading
    }

    return (
        <AgendaContext.Provider value={contextValue}>
            {children}
        </AgendaContext.Provider>
    )
}