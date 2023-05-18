var entityInput = document.getElementById("entity-input");

var CreateDtoOutput = document.getElementById("create-dto-output");
var GetDtoOutput = document.getElementById("get-dto-output");
var dtoOutput = document.getElementById("dto-output");

var vmOutput = document.getElementById("vm-output");

var createEventOutput = document.getElementById("create-event-output");
var updateEventOutput = document.getElementById("update-event-output");
var deleteEventOutput = document.getElementById("delete-event-output");

var createEventHandlerOutput = document.getElementById("create-event-handler-output");
var updateEventHandlerOutput = document.getElementById("update-event-handler-output");
var deleteEventHandlerOutput = document.getElementById("delete-event-handler-output");

var interfaceOutput = document.getElementById("interface-output");

var serviceOutput = document.getElementById("service-output");

var createCommandOutput = document.getElementById("create-command-output");
var updateCommandOutput = document.getElementById("update-command-output");
var deleteCommandOutput = document.getElementById("delete-command-output");
var loadCommandOutput = document.getElementById("load-command-output");

var getQueryOutput = document.getElementById("get-query-output");
var exportQueryOutput = document.getElementById("export-query-output");

var fileRecordOutput = document.getElementById("file-record-output");

var mapOutput = document.getElementById("map-output");

var controllerOutput = document.getElementById("controller-output");

var viewsOutput = document.getElementById("views-output");



function generate() {
    var obj = getProperties();
    generateDtos(obj);
    generateVms(obj);
    generateEvents(obj);
    generateEventHandlers(obj);
    generateInterface(obj);
    generateService(obj);
    generateCommands(obj);
    generateQueries(obj);
    generateFileRecord(obj);
    generateMap(obj);
    generateController(obj);
    generateViews(obj);
}


function getProperties() {
    var output = {};
    output.properties = []
    entityInput.value.split('\n').forEach(element => {
        var rowArr = element.split(' ')
        if (rowArr[0] == "namespace") {
            output.project = rowArr[1].split('.')[0];
        }
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

function mapProperties(obj) {
    var str = "";
    obj.properties.forEach(p => {
        str += "\t\tentity." + p.propertie + " = obj." + p.propertie + ";\n";
    });
    return str;
}


function mapNewProperties(obj) {
    var str = "";
    obj.properties.forEach(p => {
        str += "\t\t\t" + p.propertie + " = obj." + p.propertie + ",\n";
    });
    return str;
}

function mapCsv(obj) {
    var str = "";
    obj.properties.forEach((p, i) => {
        str += "\t\t\t\t\t" + p.propertie + " = values[" + i + "],\n";
    });
    return str;
}

function mapToDto(obj) {
    var str = "";
    obj.properties.forEach(p => {
        str += "\t\t\t" + p.propertie + " = request." + p.propertie + ",\n";
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

function generateEvents(obj) {
    var str = "public class " + obj.className + "CreatedEvent : DomainEvent\n";
    str += "{\n";
    str += "	public " + obj.className + "CreatedEvent(" + obj.className + " obj)\n";
    str += "	{\n";
    str += "		Obj = obj;\n";
    str += "	}\n";
    str += "	public " + obj.className + " Obj { get; }\n";
    str += "}\n";
    createEventOutput.value = str;
    str = "public class " + obj.className + "UpdatedEvent : DomainEvent\n";
    str += "{\n";
    str += "	public " + obj.className + "UpdatedEvent(" + obj.className + " obj)\n";
    str += "	{\n";
    str += "		Obj = obj;\n";
    str += "	}\n";
    str += "	public " + obj.className + " Obj { get; }\n";
    str += "}\n";
    updateEventOutput.value = str;
    str = "public class " + obj.className + "DeletedEvent : DomainEvent\n";
    str += "{\n";
    str += "	public " + obj.className + "DeletedEvent(" + obj.className + " obj)\n";
    str += "	{\n";
    str += "		Obj = obj;\n";
    str += "	}\n";
    str += "	public " + obj.className + " Obj { get; }\n";
    str += "}\n";
    deleteEventOutput.value = str;
}

function generateEventHandlers(obj) {
    var str = "public class " + obj.className + "CreatedEventHandler : INotificationHandler<DomainEventNotification<" + obj.className + "CreatedEvent>>\n";
    str += "{\n";
    str += "	private readonly ILogger<" + obj.className + "CreatedEventHandler> _logger;\n";
    str += "	public " + obj.className + "CreatedEventHandler(ILogger<" + obj.className + "CreatedEventHandler> logger)\n";
    str += "	{\n";
    str += "		_logger = logger;\n";
    str += "	}\n";
    str += "	public Task Handle(DomainEventNotification<" + obj.className + "CreatedEvent> notification, CancellationToken cancellationToken)\n";
    str += "	{\n";
    str += "		_logger.LogInformation(\"" + obj.project + " Domain Event: {DomainEvent}\", notification.GetType().Name);\n";
    str += "		return Task.CompletedTask;\n";
    str += "	}\n";
    str += "}\n";
    createEventHandlerOutput.value = str;
    str = "public class " + obj.className + "UpdatedEventHandler : INotificationHandler<DomainEventNotification<" + obj.className + "UpdatedEvent>>\n";
    str += "{\n";
    str += "	private readonly ILogger<" + obj.className + "UpdatedEventHandler> _logger;\n";
    str += "	public " + obj.className + "UpdatedEventHandler(ILogger<" + obj.className + "UpdatedEventHandler> logger)\n";
    str += "	{\n";
    str += "		_logger = logger;\n";
    str += "	}\n";
    str += "	public Task Handle(DomainEventNotification<" + obj.className + "UpdatedEvent> notification, CancellationToken cancellationToken)\n";
    str += "	{\n";
    str += "		_logger.LogInformation(\"" + obj.project + " Domain Event: {DomainEvent}\", notification.GetType().Name);\n";
    str += "		return Task.CompletedTask;\n";
    str += "	}\n";
    str += "}\n";
    updateEventHandlerOutput.value = str;
    str = "public class " + obj.className + "DeletedEventHandler : INotificationHandler<DomainEventNotification<" + obj.className + "DeletedEvent>>\n";
    str += "{\n";
    str += "	private readonly ILogger<" + obj.className + "DeletedEventHandler> _logger;\n";
    str += "	public " + obj.className + "DeletedEventHandler(ILogger<" + obj.className + "DeletedEventHandler> logger)\n";
    str += "	{\n";
    str += "		_logger = logger;\n";
    str += "	}\n";
    str += "	public Task Handle(DomainEventNotification<" + obj.className + "DeletedEvent> notification, CancellationToken cancellationToken)\n";
    str += "	{\n";
    str += "		_logger.LogInformation(\"" + obj.project + " Domain Event: {DomainEvent}\", notification.GetType().Name);\n";
    str += "		return Task.CompletedTask;\n";
    str += "	}\n";
    str += "}\n";
    deleteEventHandlerOutput.value = str;
}

function generateInterface(obj){
    var str = "public interface I" + obj.className + "Service\n";
    str += "{\n";
    str += "    Task<int> CreateAsync(Create" + obj.className + "Dto obj, CancellationToken cancellationToken);\n";
    str += "    Task<Get" + obj.className + "ListDto> GetAsync(int id);\n";
    str += "    Task<Unit> UpdateAsync(" + obj.className + "Dto obj, CancellationToken cancellationToken);\n";
    str += "    Task<Unit> DeleteAsync(int id, CancellationToken cancellationToken);\n";
    str += "    Task<int> LoadAsync(string? base64, CancellationToken cancellationToken);\n";
    str += "    Task<Export" + obj.className + "ListVm> ExportAsync(CancellationToken cancellationToken);\n";
    str += "}\n";
    interfaceOutput.value = str;
}

function generateService(obj) {
    var str = "public class " + obj.className + "Service : I" + obj.className + "Service\n";
    str += "{\n";
    str += "	private readonly IApplicationDbContext _context;\n";
    str += "	private readonly IMapper _mapper;\n";
    str += "    private readonly ICsvFileBuilder _fileBuilder;\n";
    str += "	public " + obj.className + "Service(IApplicationDbContext context, IMapper mapper, ICsvFileBuilder fileBuilder)\n";
    str += "	{\n";
    str += "		_context = context;\n";
    str += "		_mapper = mapper;\n";
    str += "        _fileBuilder = fileBuilder;\n";
    str += "	}\n\n";
    str += "	public async Task<Unit> Delete" + obj.className + "(int id, CancellationToken cancellationToken)\n";
    str += "	{\n";
    str += "		var entity = await _context." + obj.className + "s\n";
    str += "			.Where(o => o.Id == id)\n";
    str += "			.SingleOrDefaultAsync();\n";
    str += "		if (entity == null)\n";
    str += "		{\n";
    str += "			throw new NotFoundException(nameof(" + obj.className + "), id);\n";
    str += "		}\n";
    str += "		entity.AddDomainEvent(new " + obj.className + "DeletedEvent(entity));\n";
    str += "		_context." + obj.className + "s.Remove(entity);\n";
    str += "		await _context.SaveChangesAsync(cancellationToken);\n";
    str += "		return Unit.Value;\n";
    str += "	}\n\n";
    str += "	public async Task<int> CreateAsync(Create" + obj.className + "Dto obj, CancellationToken cancellationToken)\n";
    str += "	{\n";
    str += "		var entity = new " + obj.className + "\n";
    str += "		{\n";
    str += mapNewProperties(obj);
    str += "		};\n";
    str += "		entity.AddDomainEvent(new " + obj.className + "CreatedEvent(entity));\n";
    str += "		_context." + obj.className + "s.Add(entity);\n";
    str += "		await _context.SaveChangesAsync(cancellationToken);\n";
    str += "		return entity.Id;\n";
    str += "	}\n\n";
    str += "	public async Task<Get" + obj.className + "ListDto> GetAsync(int id)\n";
    str += "	{\n";
    str += "		return new Get" + obj.className + "ListDto()\n";
    str += "		{\n";
    str += "			" + obj.className + "List = await _context." + obj.className + "s\n";
    str += "			.Where(o => o.Id == id || id == 0)\n";
    str += "			.OrderBy(o => o.Id)\n";
    str += "			.ProjectTo<" + obj.className + "Dto>(_mapper.ConfigurationProvider)\n";
    str += "			.ToListAsync()\n";
    str += "		};\n";
    str += "	}\n\n";
    str += "	public async Task<Unit> UpdateAsync(" + obj.className + "Dto obj, CancellationToken cancellationToken)\n";
    str += "	{\n";
    str += "		var entity = await _context." + obj.className + "s\n";
    str += "			.FindAsync(new object[] { obj.Id }, cancellationToken);\n";
    str += "		if (entity == null)\n";
    str += "		{\n";
    str += "			throw new NotFoundException(nameof(" + obj.className + "), obj.Id);\n";
    str += "		}\n";
    str += mapProperties(obj);
    str += "		entity.AddDomainEvent(new " + obj.className + "UpdatedEvent(entity));\n";
    str += "		await _context.SaveChangesAsync(cancellationToken);\n";
    str += "		return Unit.Value;\n";
    str += "	}\n\n";
    str += "	public async Task<Unit> DeleteAsync(int id, CancellationToken cancellationToken)\n";
    str += "	{\n";
    str += "		var entity = await _context." + obj.className + "s\n";
    str += "			.Where(o => o.Id == id)\n";
    str += "			.SingleOrDefaultAsync();\n";
    str += "		if (entity == null)\n";
    str += "		{\n";
    str += "			throw new NotFoundException(nameof(" + obj.className + "), id);\n";
    str += "		}\n";
    str += "		entity.AddDomainEvent(new " + obj.className + "DeletedEvent(entity));\n";
    str += "		_context." + obj.className + "s.Remove(entity);\n";
    str += "		await _context.SaveChangesAsync(cancellationToken);\n";
    str += "		return Unit.Value;\n";
    str += "	}\n\n";
    str += "	public async Task<int> LoadAsync(string? base64, CancellationToken cancellationToken)\n";
    str += "	{\n";
    str += "		var buffer = Convert.FromBase64String(base64); ;\n";
    str += "		int c = 0;\n";
    str += "		using (var reader = new StreamReader(new MemoryStream(buffer)))\n";
    str += "		{\n";
    str += "			while (!reader.EndOfStream)\n";
    str += "			{\n";
    str += "				var line = reader.ReadLine();\n";
    str += "				var values = line.Split(';');\n";
    str += "				var entity = new " + obj.className + "()\n";
    str += "				{\n";
    str += mapCsv(obj);
    str += "				};\n";
    str += "				entity.AddDomainEvent(new " + obj.className + "CreatedEvent(entity));\n";
    str += "				await _context." + obj.className + "s.AddAsync(entity, cancellationToken);\n";
    str += "				await _context.SaveChangesAsync(cancellationToken);\n";
    str += "				c++;\n";
    str += "			}\n";
    str += "		}\n";
    str += "		return c;\n";
    str += "	}\n";
    str += "    public async Task<Export" + obj.className + "ListVm> ExportAsync(CancellationToken cancellationToken)\n";
    str += "    {\n";
    str += "        var records = await _context." + obj.className + "s\n";
    str += "            .ProjectTo<" + obj.className + "ItemFileRecord>(_mapper.ConfigurationProvider)\n";
    str += "            .ToListAsync();\n";
    str += "        var vm = new Export" + obj.className + "ListVm(\n";
    str += "            \"" + obj.className + "sList.csv\",\n";
    str += "            \"text/csv\",\n";
    str += "            _fileBuilder.Build" + obj.className + "ItemsFile(records));\n";
    str += "        return vm;\n";
    str += "	}\n";
    str += "}\n";
    serviceOutput.value = str;
}

function generateCommands(obj) {
    var str = "public record Create" + obj.className + "Command : IRequest<int>\n";
    str += "{\n";
    str += getPropertiesList(obj)
    str += "}\n";
    str += "\n";
    str += "public class Create" + obj.className + "CommandHandler : IRequestHandler<Create" + obj.className + "Command, int>\n";
    str += "{\n";
    str += "	private readonly I" + obj.className + "Service _" + obj.className.toLowerCase() + "Services;\n";
    str += "	public Create" + obj.className + "CommandHandler(I" + obj.className + "Service " + obj.className.toLowerCase() + "Services)\n";
    str += "	{\n";
    str += "		_" + obj.className.toLowerCase() + "Services = " + obj.className.toLowerCase() + "Services;\n";
    str += "	}\n";
    str += "	public async Task<int> Handle(Create" + obj.className + "Command request, CancellationToken cancellationToken)\n";
    str += "	{\n";
    str += "		var obj = new Create" + obj.className + "Dto()\n";
    str += "		{\n";
    str += mapToDto(obj);
    str += "		};\n";
    str += "		return await _" + obj.className.toLowerCase() + "Services.CreateAsync(obj, cancellationToken);\n";
    str += "	}\n";
    str += "}\n";
    createCommandOutput.value = str;
    str = "public record Update" + obj.className + "Command : IRequest<Unit>\n";
    str += "{\n";
    str += "	public int Id { get; set; }\n";
    str += getPropertiesList(obj)
    str += "}\n";
    str += "public class Update" + obj.className + "CommandHandler : IRequestHandler<Update" + obj.className + "Command, Unit>\n";
    str += "{\n";
    str += "	private readonly I" + obj.className + "Service _" + obj.className.toLowerCase() + "Services;\n";
    str += "	public Update" + obj.className + "CommandHandler(I" + obj.className + "Service " + obj.className.toLowerCase() + "Services)\n";
    str += "	{\n";
    str += "		_" + obj.className.toLowerCase() + "Services = " + obj.className.toLowerCase() + "Services;\n";
    str += "	}\n";
    str += "	public async Task<Unit> Handle(Update" + obj.className + "Command request, CancellationToken cancellationToken)\n";
    str += "	{\n";
    str += "		var obj = new " + obj.className + "Dto()\n";
    str += "		{\n";
    str += "			Id = request.Id,\n";
    str += mapToDto(obj);
    str += "		};\n";
    str += "		return await _" + obj.className.toLowerCase() + "Services.UpdateAsync(obj, cancellationToken);\n";
    str += "	}\n";
    str += "}\n";
    updateCommandOutput.value = str;
    str = "public record Delete" + obj.className + "Command : IRequest<Unit>\n";
    str += "{\n";
    str += "	public int Id { get; set; }\n";
    str += "}\n";
    str += "public class Delete" + obj.className + "CommandHandler : IRequestHandler<Delete" + obj.className + "Command, Unit>\n";
    str += "{\n";
    str += "	private readonly I" + obj.className + "Service _" + obj.className.toLowerCase() + "Services;\n";
    str += "	public Delete" + obj.className + "CommandHandler(I" + obj.className + "Service " + obj.className.toLowerCase() + "Services)\n";
    str += "	{\n";
    str += "		_" + obj.className.toLowerCase() + "Services = " + obj.className.toLowerCase() + "Services;\n";
    str += "	}\n";
    str += "	public async Task<Unit> Handle(Delete" + obj.className + "Command request, CancellationToken cancellationToken)\n";
    str += "	{\n";
    str += "		return await _" + obj.className.toLowerCase() + "Services.DeleteAsync(request.Id, cancellationToken);\n";
    str += "	}\n";
    str += "}\n";
    deleteCommandOutput.value = str;
    str = "public record Load" + obj.className + "ListCommand : IRequest<int>\n";
    str += "{\n";
    str += "	public string? base64 { get; set; }\n";
    str += "}\n";
    str += "public class Load" + obj.className + "ListCommandHandler : IRequestHandler<Load" + obj.className + "ListCommand, int>\n";
    str += "{\n";
    str += "	private readonly I" + obj.className + "Service _" + obj.className.toLowerCase() + "Services;\n";
    str += "	public Load" + obj.className + "ListCommandHandler(I" + obj.className + "Service " + obj.className.toLowerCase() + "Services)\n";
    str += "	{\n";
    str += "		_" + obj.className.toLowerCase() + "Services = " + obj.className.toLowerCase() + "Services;\n";
    str += "	}\n";
    str += "	public async Task<int> Handle(Load" + obj.className + "ListCommand request, CancellationToken cancellationToken)\n";
    str += "	{\n";
    str += "		return await _" + obj.className.toLowerCase() + "Services.LoadAsync(request.base64, cancellationToken);\n";
    str += "	}\n";
    str += "}\n";
    loadCommandOutput.value = str;
}

function generateQueries(obj) {
    var str = "public record Get" + obj.className + "ListQuery : IRequest<Get" + obj.className + "ListDto>\n";
    str += "{\n";
    str += "    public int Id { get; set; }\n";
    str += "}\n";
    str += "public class Get" + obj.className + "ListQueryHandler : IRequestHandler<Get" + obj.className + "ListQuery, Get" + obj.className + "ListDto>\n";
    str += "{\n";
    str += "    private readonly I" + obj.className + "Service _" + obj.className.toLowerCase() + "Service;\n";
    str += "    public Get" + obj.className + "ListQueryHandler(I" + obj.className + "Service " + obj.className.toLowerCase() + "Service)\n";
    str += "    {\n";
    str += "        _" + obj.className.toLowerCase() + "Service = " + obj.className.toLowerCase() + "Service;\n";
    str += "	}\n";
    str += "	public async Task<Get" + obj.className + "ListDto> Handle(Get" + obj.className + "ListQuery request, CancellationToken cancellationToken)\n";
    str += "	{\n";
    str += "		return await _" + obj.className.toLowerCase() + "Service.GetAsync(request.Id);\n";
    str += "	}\n";
    str += "}\n";
    getQueryOutput.value = str;
    str = "public record Export" + obj.className + "ListQuery : IRequest<Export" + obj.className + "ListVm>\n";
    str += "{\n";
    str += "}\n";
    str += "public class Export" + obj.className + "ListQueryHandler : IRequestHandler<Export" + obj.className + "ListQuery, Export" + obj.className + "ListVm>\n";
    str += "{\n";
    str += "    private readonly I" + obj.className + "Service _" + obj.className.toLowerCase() + "Service;\n";
    str += "    public Export" + obj.className + "ListQueryHandler(I" + obj.className + "Service " + obj.className.toLowerCase() + "Service)\n";
    str += "    {\n";
    str += "        _" + obj.className.toLowerCase() + "Service = " + obj.className.toLowerCase() + "Service;\n";
    str += "    }\n";
    str += "	public async Task<Export" + obj.className + "ListVm> Handle(Export" + obj.className + "ListQuery request, CancellationToken cancellationToken)\n";
    str += "	{\n";
    str += "		return await _" + obj.className.toLowerCase() + "Service.ExportAsync(cancellationToken);\n";
    str += "	}\n";
    str += "}\n";
    exportQueryOutput.value = str;
}

function generateFileRecord(obj) {
    var str = "public class " + obj.className + "FileRecord : IMapFrom<" + obj.className + ">\n";
    str += "{\n";
    str += getPropertiesList(obj);
    str += "}\n";
    fileRecordOutput.value = str;
}

function generateMap(obj) {
    var str = "public class " + obj.className + "RecordMap : ClassMap<" + obj.className + "FileRecord>\n";
    str += "{\n";
    str += "	public " + obj.className + "RecordMap()\n";
    str += "	{\n";
    str += "		AutoMap(CultureInfo.InvariantCulture);\n";
    str += "	}\n";
    str += "}\n";
    mapOutput.value = str;
}

function generateController(obj) {
    var str = "[Route(\"api/[controller]\")]\n";
    str += "[ApiController]\n";
    str += "public class " + obj.className + "sController : ApiControllerBase\n";
    str += "{\n";
    str += "	[HttpPost(\"CreateAsync\")]\n";
    str += "	public async Task<ActionResult<int>> CreateAsync(Create" + obj.className + "Command command)\n";
    str += "		=> await Mediator.Send(command);\n";
    str += "	[HttpGet(\"GetAsync\")]\n";
    str += "	public async Task<ActionResult<Get" + obj.className + "ListDto>> GetAsync([FromQuery] Get" + obj.className + "ListQuery query)\n";
    str += "		=> await Mediator.Send(query);\n";
    str += "	[HttpPut(\"UpdateAsync\")]\n";
    str += "	public async Task<ActionResult<Unit>> UpdateAsync(Update" + obj.className + "Command command)\n";
    str += "		=> await Mediator.Send(command);\n";
    str += "	[HttpDelete(\"DeleteAsync\")]\n";
    str += "	public async Task<ActionResult<Unit>> DeleteAsync(Delete" + obj.className + "Command command)\n";
    str += "		=> await Mediator.Send(command);\n";
    str += "	[HttpPost(\"LoadAsync\")]\n";
    str += "	public async Task<ActionResult<int>> LoadAsync(Load" + obj.className + "ListCommand command)\n";
    str += "		=> await Mediator.Send(command);\n";
    str += "	[HttpGet(\"ExportAsync\")]\n";
    str += "	public async Task<ActionResult<Export" + obj.className + "ListVm>> ExportAsync([FromQuery] Export" + obj.className + "ListQuery query)\n";
    str += "		=> await Mediator.Send(query);\n";
    str += "}\n";
    controllerOutput.value = str;
}

function generateViews(obj) {
    var str = "Views";
    viewsOutput.value = str;
}