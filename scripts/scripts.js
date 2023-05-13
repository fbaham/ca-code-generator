var interfaceOutput = document.getElementById("interface-output");
var serviceOutput = document.getElementById("service-output");
var commandsOutput = document.getElementById("commands-output");
var queriesOutput = document.getElementById("queries-output");
var controllerOutput = document.getElementById("controller-output");
var viewsOutput = document.getElementById("views-output");




function generate() {
    generateInterface();
    generateService();
    generateCommands();
    generateQueries();
    generateController();
    generateViews();
}

function generateInterface() {
    var str = "using IntegracionLaboratorioHL7.Application.Prestaciones.Commands.CreatePrestacion;\n";
    str += "using IntegracionLaboratorioHL7.Application.Prestaciones.DTOs;\n";
    str += "using IntegracionLaboratorioHL7.Domain.Entities;\n";
    str += "using MediatR;\n\n";
    str += "namespace IntegracionLaboratorioHL7.Application.Common.Interfaces;\n";
    str += "public interface IPrestacionesService\n";
    str += "{\n";
    str += "	Task<int> CreatePrestacion(string detalle, string codigoFonasa, string codigoNeolab,\n";
    str += "		string? codigoCliente, CancellationToken cancellationToken);\n";
    str += "	Task<IList<PrestacionDto>> GetPrestaciones(int id);\n";
    str += "	Task<Unit> UpdatePrestacion(int id, string? detalle, string? codigoFonasa, string? codigoNeolab,\n";
    str += "		string? codigoCliente, CancellationToken cancellationToken);\n";
    str += "	Task<Unit> DeletePrestacion(int id, CancellationToken cancellationToken);\n";
    str += "	Task<int> LoadPrestacionesFormCsv();\n";
    str += "}\n";
    interfaceOutput.textContent += str;
}

function generateService() {
    var str = "Service";
    serviceOutput.textContent += str;
}

function generateCommands() {
    var str = "Commands";
    commandsOutput.textContent += str;
}

function generateQueries() {
    var str = "Queries";
    queriesOutput.textContent += str;
}

function generateController() {
    var str = "Controller";
    controllerOutput.textContent += str;
}

function generateViews() {
    var str = "Views";
    viewsOutput.textContent += str;
}