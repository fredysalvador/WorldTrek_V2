using FirebaseAdmin;
using FirebaseAdmin.Auth;
using Google.Apis.Auth.OAuth2;
using Google.Cloud.Firestore;
using WorldTrek.Models;
using System.Security.Cryptography.X509Certificates;

namespace WorldTrek.Services
{
    public class FirebaseService
    {
        private readonly FirestoreDb _firestoreDb;
        private readonly FirebaseAuth _firebaseAuth;

        public FirebaseService()
        {
            try
            {

                string[] possiblePaths = {
                    Path.Combine(Directory.GetCurrentDirectory(), "Config", "worldtrek-aa55d-firebase-adminsdk-fbsvc-ef52620a93.json"),
                    Path.Combine(AppDomain.CurrentDomain.BaseDirectory, "Config", "worldtrek-aa55d-firebase-adminsdk-fbsvc-ef52620a93.json"),
                    "Config/worldtrek-aa55d-firebase-adminsdk-fbsvc-ef52620a93.json"
                };

                string credentialPath = "";
                foreach (string path in possiblePaths)
                {
                    if (File.Exists(path))
                    {
                        credentialPath = path;
                        Console.WriteLine($"Archivo encontrado en: {path}");
                    }
                }

                if (string.IsNullOrEmpty(credentialPath))
                {
                    throw new FileNotFoundException("Archivo no encontrado");
                }

                Environment.SetEnvironmentVariable("GOOGLE_APPLICATION_CREDENTIALS", credentialPath);

                var credential = GoogleCredential.FromFile(credentialPath);

                if (FirebaseApp.DefaultInstance == null)
                {
                    FirebaseApp.Create(new AppOptions()
                    {
                        Credential = credential,
                        ProjectId = "worldtrek-aa55d"
                    });
                }

                _firestoreDb = new FirestoreDbBuilder
                {
                    ProjectId = "worldtrek-aa55d",
                    Credential = credential
                }.Build();

                _firebaseAuth = FirebaseAuth.DefaultInstance;

                Console.WriteLine("Firebase inicializado correctamente.");

            }catch (Exception ex){ 
                Console.WriteLine($"Error inicializando Firebase: {ex.Message}");
                Console.WriteLine($"Stack trace: {ex.StackTrace}");
                throw;
            }
        }

        //Autenticacion
        public async Task<UserRecord> CreateUserAsync(string email, string password)
        {
            var userRecordArgs = new UserRecordArgs()
            {
                Email = email,
                Password = password,
                EmailVerified = false,
                Disabled = false
            };
            return await _firebaseAuth.CreateUserAsync(userRecordArgs);
        }

        public async Task<string?> VerifyTokenAsync(string idToken)
        {
            try
            {
                var decodedToken = await _firebaseAuth.VerifyIdTokenAsync(idToken);
                return decodedToken.Uid;
            }
            catch
            {
                return null;
            }
        }

        //Guardar el perfil
        public async Task SaveUserProfileAsync(string userId, object userData)
        {
            var docRef = _firestoreDb.Collection("users").Document(userId);
            await docRef.SetAsync(userData);
        }

        public async Task<T?> GetUserProfileAsync<T>(string userId) where T : class
        {
            var docRef = _firestoreDb.Collection("users").Document(userId);
            var snapshot = await docRef.GetSnapshotAsync();
            return snapshot.Exists ? snapshot.ConvertTo<T>() : null;
        }

        public async Task<List<Users>> GetAllUsersAsync()
        {
            var query = _firestoreDb.Collection("users");
            var snapshot = await query.GetSnapshotAsync();

            var users = new List<Users>();

            foreach (var document in snapshot.Documents)
            {
                users.Add(document.ConvertTo<Users>());
            }
            return users;
        }
    }
}
