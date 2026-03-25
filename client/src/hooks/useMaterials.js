import { useState, useCallback } from "react";
import { api } from "../api/client";

export function useMaterials() {
    const [materials, setMaterials] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const fetchAll = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const data = await api.get("/materials");
            setMaterials(data.materials);
        } catch (e) {
            setError(e.message);
        } finally {
            setLoading(false);
        }
    }, []);

    const generateFromText = async (text) => {
        setLoading(true);
        setError(null);
        try {
            const data = await api.post("/materials/generate", { text });
            setMaterials((prev) => [data.material, ...prev]);
            return data.material;
        } catch (e) {
            setError(e.message);
            throw e;
        } finally {
            setLoading(false);
        }
    };

    const generateFromPDF = async (file) => {
        setLoading(true);
        setError(null);
        try {
            const form = new FormData();
            form.append("pdf", file);
            const data = await api.upload("/materials/upload-pdf", form);
            setMaterials((prev) => [data.material, ...prev]);
            return data.material;
        } catch (e) {
            setError(e.message);
            throw e;
        } finally {
            setLoading(false);
        }
    };

    const remove = async (id) => {
        await api.delete(`/materials/${id}`);
        setMaterials((prev) => prev.filter((m) => m._id !== id));
    };

    return { materials, loading, error, fetchAll, generateFromText, generateFromPDF, remove };
}
