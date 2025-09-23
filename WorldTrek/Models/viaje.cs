using Google.Cloud.Firestore;

[FirestoreData]
public class Viaje
{
    [FirestoreProperty]
    public string Titulo { get; set; } = string.Empty;

    [FirestoreProperty]
    public string Destino { get; set; } = string.Empty;

    [FirestoreProperty]
    public DateTime FechaSalida { get; set; } = DateTime.UtcNow;

    [FirestoreProperty]
    public DateTime FechaRetorno { get; set; } = DateTime.UtcNow;

    [FirestoreProperty]
    public string Notas { get; set; } = string.Empty;

    [FirestoreDocumentId] // opcional, te permite mapear el Id del documento en código
    public string Id { get; set; } = string.Empty;
}
