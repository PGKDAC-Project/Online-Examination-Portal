namespace AdminServiceDotNET.Dtos
{
    public class SyllabusDto
    {
        public long? ModuleNo { get; set; }
        public string ModuleTitle { get; set; }
        public string ModuleDescription { get; set; }
        public long? EstimatedHrs { get; set; }
    }
}
