export async function fetchDeleteLocation(name: string, locationId: number, token: string): Promise<boolean> {
    const deleteUrl = `/api/locations/${locationId}`;

    const response = await fetch(deleteUrl, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': token ? `Bearer ${token}` : '',
        },
    });

    if (!response.ok) {
        if (response.status === 409) {
            throw new Error(`Localização "${name}" não encontrada.`);
        } else if (response.status === 403) {
            throw new Error("Acesso negado. Verifique as permissões.");
        } else {
            throw new Error(`Erro ao eliminar localização: ${response.statusText}`);
        }
    }

    const text = await response.text();
    if (text.trim().startsWith("<")) {
        throw new Error("Recebida resposta HTML inválida em vez de JSON.");
    }

    return true;
}
