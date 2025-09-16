using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json;
using TraMag.Server.Models;
using System.Data;
using TraMag.Server.Class;

namespace TraMag.Server.Controllers
{
    [ApiController]
    [Route("User")]
    public class UserController : Controller
    {
        private readonly ILogger<UserController> _logger;
        private readonly SessionData _sessionData;
        public UserController(ILogger<UserController> logger, SessionData servicioDatos)
        {
            _logger = logger;
            _sessionData = servicioDatos;
        }

        [HttpGet]
        [Route("GetUsuario")]
        public async Task<IActionResult> GetUsuario(string usuario, string empresa, string sede)
        {
            try
            {
                #region "Token"

                var token = "";

                var tokenResult = await Servicios.Token();

                switch (tokenResult.Status)
                {
                    case "200":
                        token = tokenResult.Response;
                        break;
                    default:
                        return StatusCode(StatusCodes.Status200OK, new
                        {
                            status = "1",
                            message = @"warn♦
                                Mensaje del sistema♦
                                Error de acceso a los servicio" +
                                      "<br>Code: <b>" + tokenResult.Status + "</b>" +
                                      "<br>Acción: <b>Consultar</b>" +
                                      "<br>Controller:<b>Maestros</b>" +
                                      "<br>Favor comunicarse con el area de soporte",
                            response = ""
                        });
                }

                #endregion

                HttpContext.Session.SetString("Token", token!);

                _sessionData.Token = token;
                _sessionData.Usuario = usuario;
                _sessionData.CodEmpresa = empresa;
                _sessionData.CodSede = sede;

                var result = await Servicios.GetUsuario(_sessionData);
                switch (result.Status)
                {
                    case "200":
                        var dtUsuario =
                            (DataTable)JsonConvert.DeserializeObject(result.Response!, typeof(DataTable))!;
                        
                        // Eliminar columnas innecesarias
                        dtUsuario.Columns.Remove("Clave");
                        dtUsuario.Columns.Remove("Clave_temporal");
                        dtUsuario.Columns.Remove("Email_origen_password");
                        
                        var jsonResult = JsonConvert.SerializeObject(dtUsuario);
                        HttpContext.Session.SetString("DataUser", jsonResult);

                        return StatusCode(StatusCodes.Status200OK, new
                        {
                            status = 200,
                            message = "Datos obtenidos correctamente",
                            response = jsonResult,
                            token
                        });

                    case "204":
                        return StatusCode(StatusCodes.Status200OK, new
                        {
                            status = 204,
                            message = "warn♦Mensaje del sistema♦No se encontraron datos para el usuario",
                            response = Array.Empty<object>()
                        });

                    default:
                        return StatusCode(StatusCodes.Status200OK, new
                        {
                            status = 204,
                            message = @"warn♦
                                Mensaje del sistema♦
                                Error de acceso a los servicios" +
                                      "<br>Code: <b>" + result.Status + "</b>" +
                                      "<br>Acción: <b>GetUsuario</b>" +
                                      "<br>Controller:<b>MaestrosController</b>" +
                                      "<br>Favor comunicarse con el área de soporte",
                            response = Array.Empty<object>()
                        });
                }
            }
            catch (Exception ex)
            {
                var message = Auxiliar.MensajeError(ex).ToString().Replace("'", "");
                return StatusCode(StatusCodes.Status500InternalServerError, new
                {
                    status = 500,
                    message = $@"error♦Error al consultar información: ♦ Se presento un error" +
                              "Error: " + message +
                              "Acción: Consultar" +
                              "Controller:<b>ConsultarUsuario" +
                              "Favor comunicarse con el area de soporte"
                });
            }
        }

        [HttpGet]
        [Route("GetMenu")]
        public async Task<IActionResult> GetMenu(string usuario, string sede)
        {
            try
            {
                var token = HttpContext.Session.GetString("Token");

                _sessionData.Token = token;
                _sessionData.Usuario = usuario;
                _sessionData.CodSede = sede;

                var result = await Servicios.GetMenu(_sessionData);
                return result.Status switch
                {
                    "200" => StatusCode(StatusCodes.Status200OK,
                        new { status = 200, message = "Datos obtenidos correctamente", response = result, token }),
                    "401" => StatusCode(StatusCodes.Status401Unauthorized,
                        new
                        {
                            status = 401,
                            message =
                                $"warn♦Ups♦No no tiene permisos para ninguna opción, por favor valide con el administrador {result.Message}",
                            response = Array.Empty<object>()
                        }),
                    _ => StatusCode(StatusCodes.Status400BadRequest, new
                    {
                        status = 400,
                        message = $"warn♦Mensaje del sistema♦Error de acceso a los servicio {result.Message} Favor comunicarse con el area de soporte",
                        response = Array.Empty<object>()
                    })
                };
            }
            catch (Exception ex)
            {
                var message = Auxiliar.MensajeError(ex).ToString().Replace("'", "");
                return StatusCode(StatusCodes.Status500InternalServerError, new
                {
                    status = 500,
                    message = $@"error♦Error al consultar información: ♦ Se presento un error" +
                              "Error: " + message +
                              "Acción: Consultar" +
                              "Controller:<b>ConsultarUsuario" +
                              "Favor comunicarse con el area de soporte"
                });
            }
        }

        [HttpGet]
        [Route("GetIcono")]
        public async Task<IActionResult> GetIcono(string aplicacion, string nombre)
        {
            try
            {
                var token = HttpContext.Session.GetString("Token");

                if (string.IsNullOrEmpty(token))
                {
                    var tokenResult = await Servicios.Token();
                    if (tokenResult.Status != "200")
                    {
                        return StatusCode(StatusCodes.Status401Unauthorized, new
                        {
                            status = 401,
                            message = "No fue posible obtener el token",
                            response = ""
                        });
                    }
                    token = tokenResult.Response;
                }

                // Usa la URL centralizada
                var urlBase = new ServicioUrl().ObtenerImagen;
                var url = $"{urlBase}?aplicacion={aplicacion}&nombreImagen={nombre}";

                using var client = new HttpClient();
                client.DefaultRequestHeaders.Authorization = new System.Net.Http.Headers.AuthenticationHeaderValue("Bearer", token);

                var response = await client.GetAsync(url);
                if (!response.IsSuccessStatusCode)
                {
                    return StatusCode((int)response.StatusCode, new
                    {
                        status = (int)response.StatusCode,
                        message = $"Error al obtener el ícono: {response.ReasonPhrase}",
                        response = ""
                    });
                }

                var svgContent = await response.Content.ReadAsStringAsync();
                return Content(svgContent, "image/svg+xml");
            }
            catch (Exception ex)
            {
                var msg = Auxiliar.MensajeError(ex).Replace("'", "");
                return StatusCode(500, new
                {
                    status = 500,
                    message = "Error al obtener ícono: " + msg,
                    response = ""
                });
            }
        }


    }
}
