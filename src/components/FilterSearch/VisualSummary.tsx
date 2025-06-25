import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface VisualSummaryProps {
    distritoSelecionado: string;
    concelhoSelecionado: string;
    freguesiaSelecionada: string;
    pontosSelecionados: string[];
    darkMode?: boolean;
}

const VisualSummary: React.FC<VisualSummaryProps> = ({
                                                         distritoSelecionado,
                                                         concelhoSelecionado,
                                                         freguesiaSelecionada,
                                                         pontosSelecionados,
                                                         darkMode = false,
                                                     }) => (
    <AnimatePresence>
        {(distritoSelecionado || concelhoSelecionado || freguesiaSelecionada) && (
            <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className={`p-4 rounded-lg shadow-inner 
          ${darkMode ? 'bg-blue-900 text-blue-200' : 'bg-blue-100 text-blue-800'}`}
            >
                <p>
                    <strong className="font-semibold">Distrito:</strong> {distritoSelecionado || 'Não selecionado'}
                </p>
                <p>
                    <strong className="font-semibold">Concelho:</strong> {concelhoSelecionado || 'Não selecionado'}
                </p>
                <p>
                    <strong className="font-semibold">Freguesia:</strong> {freguesiaSelecionada || 'Não selecionado'}
                </p>
                {pontosSelecionados.length > 0 && (
                    <div className="mt-2 flex flex-wrap gap-2">
                        {pontosSelecionados.map((p) => (
                            <span
                                key={p}
                                className={`text-sm px-3 py-1 rounded-full 
                  ${darkMode ? 'bg-blue-700 text-blue-200' : 'bg-blue-200 text-blue-800'}`}
                            >
                {p}
              </span>
                        ))}
                    </div>
                )}
            </motion.div>
        )}
    </AnimatePresence>
);

export default VisualSummary;
