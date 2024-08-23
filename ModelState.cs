namespace Authentication.Shared
{
	public class ModelState
	{
		public Dictionary<string, string> Errors { get; set; } = new Dictionary<string, string>();
		public object? Model { get; set; }

		public bool? IsValid { get; set; }

		public ModelState()
		{

		}

		public ModelState(object model)
		{
			this.Model = model;

			foreach(var property in model.GetType().GetProperties())
			{
				Errors.Add(property.Name, "");
			}
		}

		public void AddError(string propertyName, string errorMessage)
		{
			if(!string.IsNullOrEmpty(propertyName))
			{
				if(Errors.ContainsKey(propertyName))
				{
					Errors[propertyName] = errorMessage;
				}
				else
				{
					Errors.Add(propertyName, errorMessage);
				}

				IsValid = false;
			}
		}

		public string? this[string? propertyName]
		{
			get
			{
				if(string.IsNullOrEmpty(propertyName) || !Errors.ContainsKey(propertyName))
				{
					return null;
				}

				return Errors[propertyName];
			}
		}
	}
}
