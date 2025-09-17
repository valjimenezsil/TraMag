using System.Net;
using System.Net.Http.Headers;
using System.Net.Mail;
using System.Text;
using TraMag.Server.Models;
using Newtonsoft.Json;
using Newtonsoft.Json.Serialization;
using Serilog;
using Microsoft.AspNetCore.Mvc;
using System.Globalization;

namespace TraMag.Server.Class;

public class Servicios
{
    #region Log
    private readonly ILogger<Servicios> _logger;

    public Servicios(ILogger<Servicios> logger)
    {
        _logger = logger;
    }
    #endregion

    #region Token
    public static async Task<DatosSw> Token()
    {
        var servicioUrl = new ServicioUrl();

        const string usuario = "OcgnApiDesa";
        const string clave = "@cgndesa4831";

        const string paraUsuario = "?usuario=" + usuario;
        const string paraClave = "&clave=" + clave;
        var url = servicioUrl.Token;

        using var client = new HttpClient();
        client.Timeout = Timeout.InfiniteTimeSpan;
        using var response = await client.GetAsync(url + paraUsuario + paraClave + "");

        var responseBody = await response.Content.ReadAsStringAsync();
        var body = JsonConvert.DeserializeObject<DatosSw>(responseBody);
        return body!;
    }

    //WSFORMATO
    public static async Task<DatosTraza> TokenWsFormato()
    {
        var servicioUrl = new ServicioUrl();

        const string usuario = "OcgnApiDesa";
        const string clave = "@cgndesa4831";

        const string paraUsuario = "?usuario=" + usuario;
        const string paraClave = "&clave=" + clave;
        var url = servicioUrl.TokenWsFormato;

        using var client = new HttpClient();
        client.Timeout = Timeout.InfiniteTimeSpan;

        var response = await client.GetAsync(url + paraUsuario + paraClave);
        var responseBody = await response.Content.ReadAsStringAsync();

        var body = JsonConvert.DeserializeObject<DatosTraza>(responseBody);
        return body!;
    }

    #endregion

    #region Usuario

    public static async Task<DatosSw> GetUsuario(SessionData sessionData)
    {
        var servicioUrl = new ServicioUrl();
        var baseUrl = servicioUrl.FetchUsuario;

        var queryParameters = new List<string>();
        if (!string.IsNullOrEmpty(sessionData.Usuario))
            queryParameters.Add($"ide={sessionData.Usuario}");
        if (!string.IsNullOrEmpty(sessionData.CodEmpresa))
            queryParameters.Add($"empresa={sessionData.CodEmpresa}");
        if (!string.IsNullOrEmpty(sessionData.CodSede))
            queryParameters.Add($"sede={sessionData.CodSede}");

        var queryString = string.Join("&", queryParameters);
        var requestUrl = string.IsNullOrEmpty(queryString) ? baseUrl : $"{baseUrl}?{queryString}";

        using var httpClient = new HttpClient();
        httpClient.Timeout = Timeout.InfiniteTimeSpan;
        // Agregar los encabezados de autorización y Content-Type
        httpClient.DefaultRequestHeaders.Authorization =
            new AuthenticationHeaderValue("Bearer", sessionData.Token);

        var response = await httpClient.GetAsync(requestUrl);
        if (!response.IsSuccessStatusCode)
            throw new HttpRequestException(
                $"Error al obtener los datos del usuario. Código de estado: {response.StatusCode}");

        var responseBody = await response.Content.ReadAsStringAsync();

        try
        {
            return JsonConvert.DeserializeObject<DatosSw>(responseBody, new JsonSerializerSettings
            {
                ContractResolver = new DefaultContractResolver
                {
                    NamingStrategy = new CamelCaseNamingStrategy
                        { ProcessDictionaryKeys = true, OverrideSpecifiedNames = false }
                }
            }) ?? throw new JsonException("La respuesta no se pudo deserializar correctamente.");
        }
        catch (JsonException ex)
        {
            throw new InvalidOperationException("Error al procesar la respuesta del servidor.", ex);
        }
    }

    #endregion

    #region Clave Aleatoria

    /// <summary>
    /// Funcion para generar Clvaes aleatorias
    /// </summary>
    /// <param name="length"></param>
    /// <param name="tipo"></param>
    /// <returns></returns>
    public static string Clave_Aleatoria(int length, int tipo)
    {
        var random = new Random();

        var chars = tipo == 0 ? "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789" : "0123456789";

        return new string(Enumerable.Repeat(chars, length)
            .Select(s => s[random.Next(s.Length)]).ToArray());
    }

    #endregion

    #region Usuario Factor de autenticación

    public static async Task<DatosSw> Usuario_Factor(SessionData sessionData)
    {
        var servicioUrl = new ServicioUrl();

        var url = servicioUrl.UsuarioFactor;

        var data = new
        {
            AcTgUsu = sessionData.Usuario,
            ClaveTemporal = sessionData.Clave_temporal,
            ActgUMod = sessionData.Usuario,
            EstadoAut = sessionData.EstadoClaveTemporal == "1" // Convertir "1" a true y cualquier otra cosa (incluyendo "0") a false
        };

        // Serializar los datos en formato JSON
        var json = JsonConvert.SerializeObject(data);
        var content = new StringContent(json, Encoding.UTF8, "application/json");

        using var client = new HttpClient();
        client.Timeout = Timeout.InfiniteTimeSpan;

        // Agregar los encabezados de autorización y Content-Type
        client.DefaultRequestHeaders.Authorization =
            new AuthenticationHeaderValue("Bearer", sessionData.Token);
        //content.Headers.ContentType = new MediaTypeHeaderValue("application/json");

        // Enviar la solicitud POST
        var response = await client.PostAsync((string?)url, content);
        // Leer la respuesta
        var responseBody = await response.Content.ReadAsStringAsync();

        // La solicitud fue exitosa
        var body = JsonConvert.DeserializeObject<DatosSw>(responseBody);
        return body!;
    }

    #endregion

    #region Envio de correos

    public static bool SendEmail(string correoOrigen, string claveCorreoOrigen, string correosDestino, string mensaje,
        string asunto, string usuario)
    {
        var logger = Log.ForContext<Program>();
        try
        {
            var message = new MailMessage();
            message.From = new MailAddress("no-reply@zentria.com.co");

            // Soporte para múltiples destinatarios, separados por comas

            message.To.Add(correosDestino.Trim()); // Añadir cada correo al mensaje

            message.IsBodyHtml = true;
            message.Body = mensaje;
            message.Subject = "Maestros Turing Ac" + " " + asunto;
            message.Priority = MailPriority.High;

            var smtp = new SmtpClient
            {
                EnableSsl = true,
                Port = 587,
                Host = "smtp-mail.outlook.com",
                Credentials = new NetworkCredential(correoOrigen, claveCorreoOrigen)
            };

            smtp.Send(message);
            logger.Information($"Notificación enviada con éxito para el usuario {usuario}.");

            return true;
        }
        catch (SmtpException smtpEx)
        {
            // Registrar excepciones específicas de SMTP
            logger.Error($"Error de SMTP al enviar el correo para el usuario {usuario} - {smtpEx}.");
            return false;
        }
        catch (Exception ex)
        {
            // Manejar cualquier otro error inesperado
            logger.Error($"Error durante el envío de correo para el usuario {usuario} - {ex}.");
            return false;
        }
    }

    #endregion

    #region Menu

    public static async Task<DatosSw> GetMenu(SessionData sessionData)
    {
        var servicioUrl = new ServicioUrl();
        var baseUrl = servicioUrl.FetchMenu;

        const string program = "turingutatras";

        var queryParameters = new List<string>();
        if (!string.IsNullOrEmpty(sessionData.Usuario))
            queryParameters.Add($"ide={sessionData.Usuario}");
        if (!string.IsNullOrEmpty(sessionData.CodSede))
            queryParameters.Add($"sede={sessionData.CodSede}");
        if (!string.IsNullOrEmpty(program))
            queryParameters.Add($"programa={program}");

        var queryString = string.Join("&", queryParameters);
        var requestUrl = string.IsNullOrEmpty(queryString) ? baseUrl : $"{baseUrl}?{queryString}";

        using var httpClient = new HttpClient();
        httpClient.Timeout = Timeout.InfiniteTimeSpan;
        // Agregar los encabezados de autorización y Content-Type
        httpClient.DefaultRequestHeaders.Authorization =
            new AuthenticationHeaderValue("Bearer", sessionData.Token);

        var response = await httpClient.GetAsync(requestUrl);

        // Si el código de estado es 204, devolver null
        if (response.StatusCode == HttpStatusCode.NoContent)
        {
            return new DatosSw
            {
                Status = "204",
                Message = "No se encontraron datos",
                Response = null
            };
        }

        var responseBody = await response.Content.ReadAsStringAsync();

        try
        {
            return JsonConvert.DeserializeObject<DatosSw>(responseBody, new JsonSerializerSettings
            {
                ContractResolver = new DefaultContractResolver
                {
                    NamingStrategy = new CamelCaseNamingStrategy
                        { ProcessDictionaryKeys = true, OverrideSpecifiedNames = false }
                }
            }) ?? throw new JsonException("La respuesta no se pudo deserializar correctamente.");
        }
        catch (JsonException ex)
        {
            throw new InvalidOperationException("Error al procesar la respuesta del servidor.", ex);
        }
    }

    #endregion

    #region TokenTraza
    public static async Task<DatosTraza> TokenTraza()
    {
        var servicioUrl = new ServicioUrl();

        const string usuario = "OcgnApiTraza";
        const string clave = "@cgntraza1193";

        var url = servicioUrl.TokenTraza;
        var paraUsuario = "?usuario=" + usuario;
        var paraClave = "&clave=" + clave;

        using var client = new HttpClient();
        client.Timeout = Timeout.InfiniteTimeSpan;

        var response = await client.GetAsync(url + paraUsuario + paraClave);
        var responseBody = await response.Content.ReadAsStringAsync();

        var body = JsonConvert.DeserializeObject<DatosTraza>(responseBody);
        return body!;
    }

    #endregion

    #region Maestros
    //MEZCLAS
    public static async Task<DatosTraza> GetMezclas()
    {
        var tokenResult = await TokenTraza();
        if (tokenResult.status != "200")
        {
            return new DatosTraza
            {
                status = "401",
                message = "Token inválido",
                response = "Token invalido"
            };
        }

        var url = new ServicioUrl().GetMezclas;

        using var client = new HttpClient();
        client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", tokenResult.response);
        var response = await client.GetAsync(url);
        var responseBody = await response.Content.ReadAsStringAsync();

        return JsonConvert.DeserializeObject<DatosTraza>(responseBody, new JsonSerializerSettings
        {
            ContractResolver = new DefaultContractResolver
            {
                NamingStrategy = new CamelCaseNamingStrategy
                { ProcessDictionaryKeys = true, OverrideSpecifiedNames = false }
            }
        }) ?? throw new JsonException("La respuesta no se pudo deserializar correctamente.");
    }

    //PRODUCTOS
    public static async Task<DatosTraza> GetProductos()
    {
        var tokenResult = await TokenTraza();
        if (tokenResult.status != "200")
        {
            return new DatosTraza
            {
                status = "401",
                message = "Token inválido",
                response = "Token invalido"
            };
        }

        var url = new ServicioUrl().GetProductos;

        using var client = new HttpClient();
        client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", tokenResult.response);
        var response = await client.GetAsync(url);
        var responseBody = await response.Content.ReadAsStringAsync();

        return JsonConvert.DeserializeObject<DatosTraza>(responseBody, new JsonSerializerSettings
        {
            ContractResolver = new DefaultContractResolver
            {
                NamingStrategy = new CamelCaseNamingStrategy
                { ProcessDictionaryKeys = true, OverrideSpecifiedNames = false }
            }
        }) ?? throw new JsonException("La respuesta no se pudo deserializar correctamente.");
    }

    //EMPRESAS
    public static async Task<DatosTraza> GetEmpresas() { 
        var tokenResult = await TokenTraza();
        if (tokenResult.status != "200")
        {
            return new DatosTraza
            {
                status = "401",
                message = "Token inválido",
                response = "Token invalido"
            };
        }

        var url = new ServicioUrl().GetEmpresas;

        using var client = new HttpClient();
        client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", tokenResult.response);
        var response = await client.GetAsync(url);
        var responseBody = await response.Content.ReadAsStringAsync();

        return JsonConvert.DeserializeObject<DatosTraza>(responseBody, new JsonSerializerSettings
        {
            ContractResolver = new DefaultContractResolver
            {
                NamingStrategy = new CamelCaseNamingStrategy
                { ProcessDictionaryKeys = true, OverrideSpecifiedNames = false }
            }
        }) ?? throw new JsonException("La respuesta no se pudo deserializar correctamente.");
    }

    //SEDES
    public static async Task<DatosTraza> GetSedes(string empresa)
    {
        var tokenResult = await TokenTraza();
        if (tokenResult.status != "200")
        {
            return new DatosTraza
            {
                status = "401",
                message = "Token inválido",
                response = "Token invalido"
            };
        }

        var url = new ServicioUrl().GetSedes;
       
        var requestUrl = $"{url}?empresa={empresa}";

        using var client = new HttpClient();
        client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", tokenResult.response);
        var response = await client.GetAsync(requestUrl);
        var content = await response.Content.ReadAsStringAsync();

        return JsonConvert.DeserializeObject<DatosTraza>(content)!;
    }

    //SERVICIOS
    public static async Task<DatosSw> GetServicios(string empresa, string sede)
    {
        var tokenResult = await TokenTraza();
        if (tokenResult.status != "200")
        {
            return new DatosSw
            {
                Status = "401",
                Message = "Token inválido",
                Response = "Token invalido"
            };
        }

        var url = new ServicioUrl().GetServicios;
        var queryParameters = new List<string>();
        if (!string.IsNullOrEmpty(empresa))
            queryParameters.Add($"empresa={empresa}");
        if (!string.IsNullOrEmpty(sede))
            queryParameters.Add($"sede={sede}");

        var queryString = string.Join("&", queryParameters);
        var requestUrl = string.IsNullOrEmpty(queryString) ? url : $"{url}?{queryString}";


        using var client = new HttpClient();
        client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", tokenResult.response);
        var response = await client.GetAsync(requestUrl);
        var content = await response.Content.ReadAsStringAsync();

        return JsonConvert.DeserializeObject<DatosSw>(content)!;
    }

    //SERVICIOSEXT
    public static async Task<DatosSw> GetServiciosExt(string empresa, string sede)
    {
        var tokenResult = await TokenTraza();
        if (tokenResult.status != "200")
        {
            return new DatosSw
            {
                Status = "401",
                Message = "Token inválido",
                Response = "Token invalido"
            };
        }

        var url = new ServicioUrl().GetServiciosExt;
        var queryParameters = new List<string>();
        if (!string.IsNullOrEmpty(empresa))
            queryParameters.Add($"empresa={empresa}");
        if (!string.IsNullOrEmpty(sede))
            queryParameters.Add($"sede={sede}");

        var queryString = string.Join("&", queryParameters);
        var requestUrl = string.IsNullOrEmpty(queryString) ? url : $"{url}?{queryString}";


        using var client = new HttpClient();
        client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", tokenResult.response);
        var response = await client.GetAsync(requestUrl);
        var content = await response.Content.ReadAsStringAsync();

        return JsonConvert.DeserializeObject<DatosSw>(content)!;
    }

    //COLORES
    public static async Task<DatosTraza> GetColores()
    {
        var tokenResult = await TokenTraza();
        if (tokenResult.status != "200")
        {
            return new DatosTraza
            {
                status = "401",
                message = "Token inválido",
                response = "Token invalido"
            };
        }

        var url = new ServicioUrl().GetColores;

        using var client = new HttpClient();
        client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", tokenResult.response);
        var response = await client.GetAsync(url);
        var responseBody = await response.Content.ReadAsStringAsync();

        return JsonConvert.DeserializeObject<DatosTraza>(responseBody, new JsonSerializerSettings
        {
            ContractResolver = new DefaultContractResolver
            {
                NamingStrategy = new CamelCaseNamingStrategy
                { ProcessDictionaryKeys = true, OverrideSpecifiedNames = false }
            }
        }) ?? throw new JsonException("La respuesta no se pudo deserializar correctamente.");
    }

    //QFS
    public static async Task<DatosTraza> GetQFS()
    {
        var tokenResult = await TokenTraza();
        if (tokenResult.status != "200")
        {
            return new DatosTraza
            {
                status = "401",
                message = "Token inválido",
                response = "Token invalido"
            };
        }
        var url = new ServicioUrl().GetQFS;
        using var client = new HttpClient();
        client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", tokenResult.response);
        var response = await client.GetAsync(url);
        var responseBody = await response.Content.ReadAsStringAsync();
        return JsonConvert.DeserializeObject<DatosTraza>(responseBody, new JsonSerializerSettings
        {
            ContractResolver = new DefaultContractResolver
            {
                NamingStrategy = new CamelCaseNamingStrategy
                { ProcessDictionaryKeys = true, OverrideSpecifiedNames = false }
            }
        }) ?? throw new JsonException("La respuesta no se pudo deserializar correctamente.");
    }

    //TIPO PREPARACION
    public static async Task<DatosTraza> GetTipoPreparacion()
    {
            var tokenResult = await TokenTraza();
        if (tokenResult.status != "200")
        {
            return new DatosTraza
            {
                status = "401",
                message = "Token inválido",
                response = "Token invalido"
            };
        }
        var url = new ServicioUrl().GetTipoPreparacion;
        using var client = new HttpClient();
        client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", tokenResult.response);
        var response = await client.GetAsync(url);
        var responseBody = await response.Content.ReadAsStringAsync();
        return JsonConvert.DeserializeObject<DatosTraza>(responseBody, new JsonSerializerSettings
        {
            ContractResolver = new DefaultContractResolver
            {
                NamingStrategy = new CamelCaseNamingStrategy
                { ProcessDictionaryKeys = true, OverrideSpecifiedNames = false }
            }
        }) ?? throw new JsonException("La respuesta no se pudo deserializar correctamente.");
    }

    //ESTADOS
    public static async Task<DatosTraza> GetEstados(string modCod)
    {
        var tokenResult = await TokenTraza();
        if (tokenResult.status != "200")
        {
            return new DatosTraza
            {
                status = "401",
                message = "Token inválido",
                response = "Token invalido"
            };
        }
        var url = new ServicioUrl().GetEstados;

        var requestUrl = $"{url}?modCod={modCod}";

        using var client = new HttpClient();
        client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", tokenResult.response);
        var response = await client.GetAsync(requestUrl);
        var content = await response.Content.ReadAsStringAsync();

        return JsonConvert.DeserializeObject<DatosTraza>(content)!;
    }

    //MOTIVOS DE DEV
    public static async Task<DatosTraza> GetMotDev()
    {
        var tokenResult = await TokenTraza();
        if (tokenResult.status != "200")
        {
            return new DatosTraza
            {
                status = "401",
                message = "Token inválido",
                response = "Token invalido"
            };
        }
        var url = new ServicioUrl().GetMotDev;

        using var client = new HttpClient();
        client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", tokenResult.response);
        var response = await client.GetAsync(url);
        var content = await response.Content.ReadAsStringAsync();

        return JsonConvert.DeserializeObject<DatosTraza>(content)!;
    }
    #endregion

    #region Alistamiento
    //INSERTAR ALISTAMIENTO
    public static async Task<DatosTraza> InsertTraMagAli(Alistamiento payload)
    {
        var tokenResult = await TokenTraza();
        if (tokenResult.status != "200")
        {
            return new DatosTraza
            {
                status = "401",
                message = "Token inválido",
                response = "Token invalido"
            };
        }
        var url = new ServicioUrl().InsertTraMagAli;
        var json = JsonConvert.SerializeObject(payload);
        var content = new StringContent(json, Encoding.UTF8, "application/json");
        using var client = new HttpClient();
        client.DefaultRequestHeaders.Authorization =
            new AuthenticationHeaderValue("Bearer", tokenResult.response);
        var response = await client.PostAsync(url, content);
        var responseBody = await response.Content.ReadAsStringAsync();
        return JsonConvert.DeserializeObject<DatosTraza>(responseBody)!;
    }

    //OBTENER INFO DE ALISTAMIENTO DEL DIA 
    public static async Task<DatosTraza> GetTraMagAliLog(string prepcod) {
        var tokenResult = await TokenTraza();
        if (tokenResult.status != "200")
        {
            return new DatosTraza
            {
                status = "401",
                message = "Token inválido",
                response = "Token invalido"
            };
        }

        var url = new ServicioUrl().GetTraMagAliLog;
        var queryParameters = new List<string>();
        if (!string.IsNullOrEmpty(prepcod))
            queryParameters.Add($"PrepCod={prepcod}");

        var queryString = string.Join("&", queryParameters);
        var requestUrl = string.IsNullOrEmpty(queryString) ? url : $"{url}?{queryString}";

        using var client = new HttpClient();
        client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", tokenResult.response);
        var response = await client.GetAsync(requestUrl);
        var content = await response.Content.ReadAsStringAsync();

        return JsonConvert.DeserializeObject<DatosTraza>(content)!;
    }

    //CANCELAR ALISTAMIENTO
    public static async Task<DatosTraza> CancelTraMagAli(CancelarAlistamiento payload)
    {
        var tokenResult = await TokenTraza();
        if (tokenResult.status != "200")
        {
            return new DatosTraza
            {
                status = "401",
                message = "Token inválido",
                response = "Token invalido"
            };
        }
        var url = new ServicioUrl().CancelTraMagAli;
        var json = JsonConvert.SerializeObject(payload);
        var content = new StringContent(json, Encoding.UTF8, "application/json");
        using var client = new HttpClient();
        client.DefaultRequestHeaders.Authorization =
            new AuthenticationHeaderValue("Bearer", tokenResult.response);
        var response = await client.PostAsync(url, content);
        var responseBody = await response.Content.ReadAsStringAsync();
        return JsonConvert.DeserializeObject<DatosTraza>(responseBody)!;
    }

    #endregion

    #region Solicitudes
    // INSERTAR SOLICITUDES EXTERNAS
    public static async Task<DatosTraza> InsertTraMagSolExt(InsertSolicitudExt payload)
    {
        var tokenResult = await TokenTraza();
        if (tokenResult.status != "200")
        {
            return new DatosTraza
            {
                status = "401",
                message = "Token inválido",
                response = "Token invalido"
            };
        }
        var url = new ServicioUrl().InsertTraMagSolExt;

        var json = JsonConvert.SerializeObject(payload);
        var content = new StringContent(json, Encoding.UTF8, "application/json");

        using var client = new HttpClient();

        client.DefaultRequestHeaders.Authorization =
            new AuthenticationHeaderValue("Bearer", tokenResult.response);
        var response = await client.PostAsync(url, content);
        var responseBody = await response.Content.ReadAsStringAsync();

        return JsonConvert.DeserializeObject<DatosTraza>(responseBody)!;
    }

    //GET ORDENES EXTERNAS
    public static async Task<DatosTraza> GetOrdenesExt(string empresa, string sede, string servicio)
    {
        var tokenResult = await TokenTraza();
        if (tokenResult.status != "200")
        {
            return new DatosTraza
            {
                status = "401",
                message = "Token inválido",
                response = "Token invalido"
            };
        }

        var url = new ServicioUrl().GetOrdenesExt;
        var queryParameters = new List<string>();
        if (!string.IsNullOrEmpty(empresa))
            queryParameters.Add($"empresa={empresa}");
        if (!string.IsNullOrEmpty(sede))
            queryParameters.Add($"sede={sede}");
        if (!string.IsNullOrEmpty(servicio))
            queryParameters.Add($"servicio={servicio}");

        var queryString = string.Join("&", queryParameters);
        var requestUrl = string.IsNullOrEmpty(queryString) ? url : $"{url}?{queryString}";


        using var client = new HttpClient();
        client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", tokenResult.response);
        var response = await client.GetAsync(requestUrl);
        var content = await response.Content.ReadAsStringAsync();

        return JsonConvert.DeserializeObject<DatosTraza>(content)!;
    }

    //CANCELAR SOLICITUDES EXTERNAS
    public static async Task<DatosTraza> CancelSolicitudesExt(CancelarSolicitudes payload)
    {
        var tokenResult = await TokenTraza();
        if (tokenResult.status != "200")
        {
            return new DatosTraza
            {
                status = "401",
                message = "Token inválido",
                response = "Token invalido"
            };
        }
        var url = new ServicioUrl().CancelSolicitudesExt;

        var json = JsonConvert.SerializeObject(payload);
        var content = new StringContent(json, Encoding.UTF8, "application/json");

        using var client = new HttpClient();

        client.DefaultRequestHeaders.Authorization =
            new AuthenticationHeaderValue("Bearer", tokenResult.response);
        var response = await client.PostAsync(url, content);
        var responseBody = await response.Content.ReadAsStringAsync();

        return JsonConvert.DeserializeObject<DatosTraza>(responseBody)!;
    }
    #endregion

    #region Producción
    //ORDENES DE PRODUCCIÓN
    public static async Task<DatosTraza> GetOrdenes(string empresa, string sede,string servicio)
    {
        var tokenResult = await TokenTraza();
        if (tokenResult.status != "200")
        {
            return new DatosTraza
            {
                status = "401",
                message = "Token inválido",
                response = "Token invalido"
            };
        }

        var url = new ServicioUrl().GetOrdenes;
        var queryParameters = new List<string>();
        if (!string.IsNullOrEmpty(empresa))
            queryParameters.Add($"empresa={empresa}");
        if (!string.IsNullOrEmpty(sede))
            queryParameters.Add($"sede={sede}");
        if (!string.IsNullOrEmpty(servicio))
            queryParameters.Add($"servicio={servicio}");

        var queryString = string.Join("&", queryParameters);
        var requestUrl = string.IsNullOrEmpty(queryString) ? url : $"{url}?{queryString}";


        using var client = new HttpClient();
        client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", tokenResult.response);
        var response = await client.GetAsync(requestUrl);
        var content = await response.Content.ReadAsStringAsync();

        return JsonConvert.DeserializeObject<DatosTraza>(content)!;
    }

    //TRAMAG1 INFORMACIONDE ETIQUETA
    public static async Task<DatosTraza> GetTraMag1(string empresa, string sede, string csc)
    {
        var tokenResult = await TokenTraza();
        if (tokenResult.status != "200")
        {
            return new DatosTraza
            {
                status = "401",
                message = "Token inválido",
                response = "Token invalido"
            };
        }

        var url = new ServicioUrl().GetTraMag1;
        var queryParameters = new List<string>();
        if (!string.IsNullOrEmpty(empresa))
            queryParameters.Add($"empresa={empresa}");
        if (!string.IsNullOrEmpty(sede))
            queryParameters.Add($"sede={sede}");
        if (!string.IsNullOrEmpty(csc))
            queryParameters.Add($"csc={csc}");

        var queryString = string.Join("&", queryParameters);
        var requestUrl = string.IsNullOrEmpty(queryString) ? url : $"{url}?{queryString}";


        using var client = new HttpClient();
        client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", tokenResult.response);
        var response = await client.GetAsync(requestUrl);
        var content = await response.Content.ReadAsStringAsync();

        return JsonConvert.DeserializeObject<DatosTraza>(content)!;
    }

    //INSERTAR PRODUCCIÓN
    public static async Task<DatosTraza> InsertTraMagPro(InsertarProduccion payload)
    {
        var tokenResult = await TokenTraza();
        if (tokenResult.status != "200")
        {
            return new DatosTraza
            {
                status = "401",
                message = "Token inválido",
                response = "Token invalido"
            };
        }
        var url = new ServicioUrl().InsertTraMagPro;

        var json = JsonConvert.SerializeObject(payload);
        var content = new StringContent(json, Encoding.UTF8, "application/json");

        using var client = new HttpClient();

        client.DefaultRequestHeaders.Authorization =
            new AuthenticationHeaderValue("Bearer", tokenResult.response);
        var response = await client.PostAsync(url, content);
        var responseBody = await response.Content.ReadAsStringAsync();

        return JsonConvert.DeserializeObject<DatosTraza>(responseBody)!;
    }
    //ACTUALIZAR PRODUCCIÓN
    public static async Task<DatosTraza> UpdateTraMagPro(InsertarProduccion payload)
    {
        var tokenResult = await TokenTraza();
        if (tokenResult.status != "200")
        {
            return new DatosTraza
            {
                status = "401",
                message = "Token inválido",
                response = "Token invalido"
            };
        }
        var url = new ServicioUrl().UpdateTraMagPro;

        var json = JsonConvert.SerializeObject(payload);
        var content = new StringContent(json, Encoding.UTF8, "application/json");

        using var client = new HttpClient();

        client.DefaultRequestHeaders.Authorization =
            new AuthenticationHeaderValue("Bearer", tokenResult.response);
        var response = await client.PostAsync(url, content);
        var responseBody = await response.Content.ReadAsStringAsync();

        return JsonConvert.DeserializeObject<DatosTraza>(responseBody)!;
    }

    //CANCELAR PRODUCCIÓN
    public static async Task<DatosTraza> CancelTraMagPro(CancelarProduccion payload)
    {
        var tokenResult = await TokenTraza();
        if (tokenResult.status != "200")
        {
            return new DatosTraza
            {
                status = "401",
                message = "Token inválido",
                response = "Token invalido"
            };
        }
        var url = new ServicioUrl().CancelTraMagPro;

        var json = JsonConvert.SerializeObject(payload);
        var content = new StringContent(json, Encoding.UTF8, "application/json");

        using var client = new HttpClient();

        client.DefaultRequestHeaders.Authorization =
            new AuthenticationHeaderValue("Bearer", tokenResult.response);
        var response = await client.PostAsync(url, content);
        var responseBody = await response.Content.ReadAsStringAsync();

        return JsonConvert.DeserializeObject<DatosTraza>(responseBody)!;
    }

    //INFORMACION PARA IMPRIMIR EN LA ETIQUETA
    public static async Task<DatosTraza> GetTraMag1Eti(List<InfoEtiqueta> payload)
    {
        var tokenResult = await TokenTraza();
        if (tokenResult.status != "200")
        {
            return new DatosTraza
            {
                status = "401",
                message = "Token inválido",
                response = "Token invalido"
            };
        }

        var url = new ServicioUrl().GetTraMag1Eti;
        var json = JsonConvert.SerializeObject(payload);
        var content = new StringContent(json, Encoding.UTF8, "application/json");

        using var client = new HttpClient();

        client.DefaultRequestHeaders.Authorization =
            new AuthenticationHeaderValue("Bearer", tokenResult.response);
        var response = await client.PostAsync(url, content);
        var responseBody = await response.Content.ReadAsStringAsync();

        return JsonConvert.DeserializeObject<DatosTraza>(responseBody)!;
    }

    //IMPRIMIR ETIQUETA EN PDF
    public static async Task<(int StatusCode, byte[]? Pdf, string? FileName, string? ErrorBody)> GetPdfEti(List<InfoEtiquetaPdf> payload)
    {
        var tokenResult = await TokenWsFormato();
        if (tokenResult.status != "200")
        {
            return (401, null, null, "Token inválido");
        }

        var url = new ServicioUrl().GetPdfEti;
        var json = JsonConvert.SerializeObject(payload);
        var content = new StringContent(json, Encoding.UTF8, "application/json");

        using var client = new HttpClient();

        client.DefaultRequestHeaders.Authorization =
            new AuthenticationHeaderValue("Bearer", tokenResult.response);
        var response = await client.PostAsync(url, content);
        var pdf = await response.Content.ReadAsByteArrayAsync();
        var cd = response.Content.Headers.ContentDisposition;
        string? fileName = cd?.FileNameStar ?? cd?.FileName ?? "EtiqMagistral.pdf";

        return ((int)response.StatusCode, pdf, fileName, null);
    }
    #endregion

    #region Revision
    public static async Task<DatosTraza> GetTraMagRev(string empresa, string sede, string servicio)
    {
        var tokenResult = await TokenTraza();
        if (tokenResult.status != "200")
        {
            return new DatosTraza
            {
                status = "401",
                message = "Token inválido",
                response = "Token invalido"
            };
        }
        var url = new ServicioUrl().GetTraMagRev;
        var queryParameters = new List<string>();
        if (!string.IsNullOrEmpty(empresa))
            queryParameters.Add($"empresa={empresa}");
        if (!string.IsNullOrEmpty(sede))
            queryParameters.Add($"sede={sede}");
        if (!string.IsNullOrEmpty(servicio))
            queryParameters.Add($"servicio={servicio}");

        var queryString = string.Join("&", queryParameters);
        var requestUrl = string.IsNullOrEmpty(queryString) ? url : $"{url}?{queryString}";


        using var client = new HttpClient();
        client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", tokenResult.response);
        var response = await client.GetAsync(requestUrl);
        var content = await response.Content.ReadAsStringAsync();

        return JsonConvert.DeserializeObject<DatosTraza>(content)!;

    }
    #endregion

    #region Reportes
    //BUSQUEDA DE LA TABLA DE ORDEN DE PRODUCCIÓN
    public static async Task<DatosTraza> GetOrdDeProd1(string empresa, string sede, string servicio, string fecha)
    {
        var tokenResult = await TokenTraza();
        if (tokenResult.status != "200")
        {
            return new DatosTraza
            {
                status = "401",
                message = "Token inválido",
                response = "Token invalido"
            };
        }

        var url = new ServicioUrl().GetOrdDeProd1;
        var queryParameters = new List<string>();
        if (!string.IsNullOrEmpty(fecha))
            queryParameters.Add($"fecha={fecha}");
        if (!string.IsNullOrEmpty(empresa))
            queryParameters.Add($"empresa={empresa}");
        if (!string.IsNullOrEmpty(sede))
            queryParameters.Add($"sede={sede}");
        if (!string.IsNullOrEmpty(servicio))
            queryParameters.Add($"servicio={servicio}");


        var queryString = string.Join("&", queryParameters);
        var requestUrl = string.IsNullOrEmpty(queryString) ? url : $"{url}?{queryString}";


        using var client = new HttpClient();
        client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", tokenResult.response);
        var response = await client.GetAsync(requestUrl);
        var content = await response.Content.ReadAsStringAsync();

        return JsonConvert.DeserializeObject<DatosTraza>(content)!;
    }

    //BUSQUEDA DE LA TABLA DE ORDEN DE PRODUCCIÓN DE SOLICITUDES EXTERNAS
    public static async Task<DatosTraza> GetOrdDeProdExt1(string empresa, string sede, string servicio, string fecha)
    {
        var tokenResult = await TokenTraza();
        if (tokenResult.status != "200")
        {
            return new DatosTraza
            {
                status = "401",
                message = "Token inválido",
                response = "Token invalido"
            };
        }

        var url = new ServicioUrl().GetOrdDeProdExt1;
        var queryParameters = new List<string>();
        if (!string.IsNullOrEmpty(fecha))
            queryParameters.Add($"fecha={fecha}");
        if (!string.IsNullOrEmpty(empresa))
            queryParameters.Add($"empresa={empresa}");
        if (!string.IsNullOrEmpty(sede))
            queryParameters.Add($"sede={sede}");
        if (!string.IsNullOrEmpty(servicio))
            queryParameters.Add($"servicio={servicio}");


        var queryString = string.Join("&", queryParameters);
        var requestUrl = string.IsNullOrEmpty(queryString) ? url : $"{url}?{queryString}";


        using var client = new HttpClient();
        client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", tokenResult.response);
        var response = await client.GetAsync(requestUrl);
        var content = await response.Content.ReadAsStringAsync();

        return JsonConvert.DeserializeObject<DatosTraza>(content)!;
    }
    
    public static async Task<DatosTraza> GetInfoReporteOrdProd (string empresa, string sede, string servicio, string codapli, string fecha, string tipoOrden)
    {
        var tokenResult = await TokenTraza();
        if (tokenResult.status != "200")
        {
            return new DatosTraza
            {
                status = "401",
                message = "Token inválido",
                response = "Token invalido"
            };
        }
        var url = new ServicioUrl().GetInfoReporteOrdProd;
        var queryParameters = new List<string>();
        if (!string.IsNullOrEmpty(empresa))
            queryParameters.Add($"empresa={empresa}");
        if (!string.IsNullOrEmpty(sede))
            queryParameters.Add($"sede={sede}");
        if (!string.IsNullOrEmpty(servicio))
            queryParameters.Add($"servicio={servicio}");
        if (!string.IsNullOrEmpty(codapli))
            queryParameters.Add($"codapli={codapli}");
        if (!string.IsNullOrEmpty(fecha))
            queryParameters.Add($"fecha={fecha}");
        if (!string.IsNullOrEmpty(tipoOrden))
            queryParameters.Add($"tipoOrden={tipoOrden}");
        var queryString = string.Join("&", queryParameters);
        var requestUrl = string.IsNullOrEmpty(queryString) ? url : $"{url}?{queryString}";

        using var client = new HttpClient();
        client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", tokenResult.response);
        var response = await client.GetAsync(requestUrl);
        var content = await response.Content.ReadAsStringAsync();

        return JsonConvert.DeserializeObject<DatosTraza>(content)!;
    }

    //PDF ORDEN DE PRODUCCION
    public static async Task<(int StatusCode, byte[]? Pdf, string? FileName, string? ErrorBody)> GetPdfOrdDeProd1(List<InfoRepOrdDeProd> payload)
    {
        var tokenResult = await TokenWsFormato();
        if (tokenResult.status != "200")
        {
            return (401, null, null, "Token inválido");
        }

        var url = new ServicioUrl().GetPdfOrdDeProd1;
        var json = JsonConvert.SerializeObject(payload);
        var content = new StringContent(json, Encoding.UTF8, "application/json");

        using var client = new HttpClient();

        client.DefaultRequestHeaders.Authorization =
            new AuthenticationHeaderValue("Bearer", tokenResult.response);
        var response = await client.PostAsync(url, content);
        var pdf = await response.Content.ReadAsByteArrayAsync();
        var cd = response.Content.Headers.ContentDisposition;
        string? fileName = cd?.FileNameStar ?? cd?.FileName ?? "OrdendeProduccion.pdf";

        return ((int)response.StatusCode, pdf, fileName, null);
    }

    #endregion
}