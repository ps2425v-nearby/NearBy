import React from "react";
import { Link } from "react-router-dom";
import { StretchHorizontal, Trash2 } from "lucide-react";
import { SimpleLocation } from "@/types/SimpleLocationType";

interface Props {
    locations: SimpleLocation[];
    onCompare: (id:number,name:string)=>void;
    onDelete: (name:string,id:number)=>void;
    disableCompare: (loc:SimpleLocation)=>boolean;
}
export const SavedList: React.FC<Props> = ({ locations,onCompare, onDelete, disableCompare }) => (
    <ul className="space-y-4">
        {locations.map((l)=>(
            <li key={l.id} className="bg-gray-100 dark:bg-gray-700 rounded-lg p-4 flex justify-between items-center">
                <Link to="/" state={{lat:l.lat,lon:l.lon,searchRadius:l.searchRadius,timestamp:Date.now()}} className="text-blue-600 dark:text-blue-400 hover:underline font-medium">
                    {l.name}<br/>
                    <span className="text-sm text-gray-500 dark:text-gray-300">{l.lat}, {l.lon}</span>
                </Link>
                <div className="flex gap-2">
                    <button onClick={()=>onCompare(l.id,l.name)} disabled={disableCompare(l)} aria-label="Comparar"
                            className={`flex items-center gap-1 font-semibold px-3 py-1 rounded ${disableCompare(l)?"opacity-50 cursor-not-allowed bg-yellow-200":"bg-yellow-400 hover:bg-yellow-500 text-black"}`}>
                        <StretchHorizontal size={16}/>Comparar
                    </button>
                    <button onClick={()=>onDelete(l.name,l.id)} aria-label="Eliminar"
                            className="flex items-center gap-1 bg-red-500 hover:bg-red-600 text-white font-semibold px-3 py-1 rounded">
                        <Trash2 size={16}/>Eliminar
                    </button>
                </div>
            </li>))}
    </ul>
);
