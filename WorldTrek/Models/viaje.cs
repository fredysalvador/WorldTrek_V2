using Google.Cloud.Firestore;
using System;

namespace WorldTrek.Models
{
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
    }
}
