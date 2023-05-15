var entityInput = document.getElementById("entity-input");
var CreateDtoOutput = document.getElementById("create-dto-output");
var GetDtoOutput = document.getElementById("get-dto-output");
var dtoOutput = document.getElementById("dto-output");
var vmOutput = document.getElementById("vm-output");
var serviceOutput = document.getElementById("service-output");
var commandsOutput = document.getElementById("commands-output");
var queriesOutput = document.getElementById("queries-output");
var controllerOutput = document.getElementById("controller-output");
var viewsOutput = document.getElementById("views-output");



function generate() {
    var obj = getProperties();
    generateDtos(obj);
    generateVms(obj);
    generateService(obj);
    generateCommands(obj);
    generateQueries(obj);
    generateController(obj);
    generateViews(obj);
}


function getProperties() {
    var output = {};
    output.properties = []
    entityInput.value.split('\n').forEach(element => {
        var rowArr = element.split(' ')
        if (rowArr[0] == "public" && rowArr[1] == "class") {
            output.className = rowArr[2]
        }
        if (rowArr[4] == "public") {
            output.properties.push({ type: rowArr[5], propertie: rowArr[6] })
        }
    });
    return output;
}

function getPropertiesList(obj) {
    var str = "";
    obj.properties.forEach(p => {
        str += "\tpublic " + p.type + " " + p.propertie + " { get; set;}\n";
    });
    return str;
}

function generateDtos(obj) {
    var str = "public class Create" + obj.className + "Dto\n{\n";
    str += getPropertiesList(obj);
    str += "}";
    CreateDtoOutput.value = str;
    str = "public class Get" + obj.className + "ListDto\n{\n";
    str += "\tpublic Get" + obj.className + "ListDto() \n\t{\n";
    str += "\t\t" + obj.className + "List = new List<" + obj.className + "Dto>() ;\n\t}\n";
    str += "\tpublic IList<" + obj.className + "Dto> " + obj.className + "List { get; set; }\n}\n";
    GetDtoOutput.value = str;
    var str = "public class " + obj.className + "Dto : IMapFrom<" + obj.className + ">\n{\n";
    str += "\tpublic int Id { get; set;}\n";
    str += getPropertiesList(obj);
    str += "}";
    dtoOutput.value = str;
}

function generateVms(obj) {
    var str = "public class Export" + obj.className + "ListVm\n{\n";
    str += "\tpublic Export" + obj.className + "ListVm(string fileName, string contentType, byte[] content)\n\t{\n";
    str += "\t\tFileName = fileName;\n\t\tContentType = contentType;\n\t\tContent = content;\n\t}\n";
    str += "\tpublic string FileName { get; set; }\n";
    str += "\tpublic string ContentType { get; set; }\n";
    str += "\tpublic byte[] Content { get; set; }\n}";
    vmOutput.value = str;
}

function generateService(obj) {
    var str = "public class " + obj.className + "Service : IEntityService<Create" + obj.className + "Dto, Get" + obj.className + "ListDto, " + obj.className + "Dto, Export" + obj.className + "ListVm>\n";
    str += "{\n";
    str += "	private readonly IApplicationDbContext _context;\n";
    str += "	private readonly IMapper _mapper;\n";
    str += "	public " + obj.className + "Service(IApplicationDbContext context, IMapper mapper)\n";
    str += "	{\n";
    str += "		_context = context;\n";
    str += "		_mapper = mapper;\n";
    str += "	}\n\n";
    str += "	public async Task<Unit> Delete" + obj.className + "(int id, CancellationToken cancellationToken)\n";
    str += "	{\n";
    str += "		var entity = await _context." + obj.className + "es\n";
    str += "			.Where(o => o.Id == id)\n";
    str += "			.SingleOrDefaultAsync();\n";
    str += "		if (entity == null)\n";
    str += "		{\n";
    str += "			throw new NotFoundException(nameof(" + obj.className + "), id);\n";
    str += "		}\n";
    str += "		entity.AddDomainEvent(new " + obj.className + "DeletedEvent(entity));\n";
    str += "		_context." + obj.className + "es.Remove(entity);\n";
    str += "		await _context.SaveChangesAsync(cancellationToken);\n";
    str += "		return Unit.Value;\n";
    str += "	}\n\n";
    str += "	public async Task<int> CreateAsync(Create" + obj.className + "Dto obj, CancellationToken cancellationToken)\n";
    str += "	{\n";
    str += "		var entity = new " + obj.className + "\n";
    str += "		{\n";
    str += "			detalle = obj.detalle,\n";
    str += "			codigoFonasa = obj.codigoFonasa,\n";
    str += "			codigoNeolab = obj.codigoNeolab,\n";
    str += "			codigoCliente = obj.codigoCliente,\n";
    str += "		};\n";
    str += "		entity.AddDomainEvent(new " + obj.className + "CreatedEvent(entity));\n";
    str += "		_context." + obj.className + "es.Add(entity);\n";
    str += "		await _context.SaveChangesAsync(cancellationToken);\n";
    str += "		return entity.Id;\n";
    str += "	}\n\n";
    str += "	public Get" + obj.className + "ListDto Get(int id)\n";
    str += "	{\n";
    str += "		return new Get" + obj.className + "ListDto()\n";
    str += "		{\n";
    str += "			" + obj.className + "List = _context." + obj.className + "es\n";
    str += "			.Where(o => o.Id == id || id == 0)\n";
    str += "			.OrderBy(o => o.codigoFonasa)\n";
    str += "			.ProjectTo<" + obj.className + "Dto>(_mapper.ConfigurationProvider)\n";
    str += "			.ToList()\n";
    str += "		};\n";
    str += "	}\n\n";
    str += "	public async Task<Unit> UpdateAsync(" + obj.className + "Dto obj, CancellationToken cancellationToken)\n";
    str += "	{\n";
    str += "		var entity = await _context." + obj.className + "es\n";
    str += "			.FindAsync(new object[] { obj.Id }, cancellationToken);\n";
    str += "		if (entity == null)\n";
    str += "		{\n";
    str += "			throw new NotFoundException(nameof(" + obj.className + "), obj.Id);\n";
    str += "		}\n";
    str += "		entity.detalle = obj.detalle;\n";
    str += "		entity.codigoFonasa = obj.codigoFonasa;\n";
    str += "		entity.codigoNeolab = obj.codigoNeolab;\n";
    str += "		entity.codigoCliente = obj.codigoCliente;\n";
    str += "		entity.AddDomainEvent(new " + obj.className + "UpdatedEvent(entity));\n";
    str += "		await _context.SaveChangesAsync(cancellationToken);\n";
    str += "		return Unit.Value;\n";
    str += "	}\n\n";
    str += "	public async Task<Unit> DeleteAsync(int id, CancellationToken cancellationToken)\n";
    str += "	{\n";
    str += "		var entity = await _context." + obj.className + "es\n";
    str += "			.Where(o => o.Id == id)\n";
    str += "			.SingleOrDefaultAsync();\n";
    str += "		if (entity == null)\n";
    str += "		{\n";
    str += "			throw new NotFoundException(nameof(" + obj.className + "), id);\n";
    str += "		}\n";
    str += "		entity.AddDomainEvent(new " + obj.className + "DeletedEvent(entity));\n";
    str += "		_context." + obj.className + "es.Remove(entity);\n";
    str += "		await _context.SaveChangesAsync(cancellationToken);\n";
    str += "		return Unit.Value;\n";
    str += "	}\n\n";
    str += "	public Task<int> LoadAsync()\n";
    str += "	{\n";
    str += "		throw new NotImplementedException();\n\n";
    str += "	}\n";
    str += "	public Export" + obj.className + "ListVm Export()\n";
    str += "	{\n";
    str += "		throw new NotImplementedException();\n";
    str += "	}\n";
    str += "}\n";
    serviceOutput.value = str;
}

function generateCommands(obj) {
    var str = "Commands";
    commandsOutput.value = str;
}

function generateQueries(obj) {
    var str = "Queries";
    queriesOutput.value = str;
}

function generateController(obj) {
    var str = "Controller";
    controllerOutput.value = str;
}

function generateViews(obj) {
    var str = "Views";
    viewsOutput.value = str;
}