namespace TraMag.Server.Class;

public class DatosSw
{
    public string? Status { get; set; }
    public string? Message { get; set; }
    public string? Response { get; set; }
}
public class DatosTraza
{
    public string? status { get; set; }
    public string? message { get; set; }
    public string? response { get; set; }
}


public class ApiResponse<T>
{
    public int Status { get; set; }
    public string? Message { get; set; }
    public List<T>? Response { get; set; }
}

public class ApiResponse
{
    public object? Response { get; set; }
}