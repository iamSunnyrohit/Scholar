import { useState, useCallback } from "react";
import { api } from "../api/client";

export function useFlashcards(materialId) {
    const [flashcards, setFlashcards] = useState([]);
    const [loading, setLoading] = useState(false);

    const fetch = useCallback(async () => {
        if (!materialId) return;
        setLoading(true);
        try {
            const data = await api.get(`/flashcards/${materialId}`);
            setFlashcards(data.flashcards);
        } finally {
            setLoading(false);
        }
    }, [materialId]);

    const review = async (cardId, correct) => {
        const data = await api.patch(`/flashcards/${cardId}/review`, { correct });
        setFlashcards((prev) =>
            prev.map((c) => (c._id === cardId ? data.flashcard : c))
        );
        return data.flashcard;
    };

    return { flashcards, setFlashcards, loading, fetch, review };
}
