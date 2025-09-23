using Google.Cloud.Firestore;
using System;
using System.Collections.Generic;

namespace WorldTrek.Models
{
    [FirestoreData]
    public class Users
    {
        [FirestoreProperty]
        public string Id { get; set; } = string.Empty;

        [FirestoreProperty]
        public string Email { get; set; } = string.Empty;

        [FirestoreProperty]
        public string Name { get; set; } = string.Empty;

        [FirestoreProperty]
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        [FirestoreProperty]
        public string PasswordHash { get; set; } = string.Empty;
    }
}
