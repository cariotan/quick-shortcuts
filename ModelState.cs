using System.Dynamic;
using System.Text.Json.Serialization;

namespace BlazorApp1.Shared
{
	public class ModelState
	{
		public Dictionary<string, string> Errors { get; set; } = new Dictionary<string, string>();

		public bool? IsValid { get; set; }

		public ModelState()
		{

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

	public class ModelState<T> : ModelState where T : IModel
	{
		public T? Model { get; set; }

		[JsonIgnore]
		public dynamic Dynamic { get; set; } = new ExpandoObject();

		public ModelState(T model)
		{
			if(model != null)
			{
				Model = model;

				foreach(var property in model.GetType().GetProperties())
				{
					Errors.Add(property.Name, "");
				}

				model.Validate(this);

				Dynamic.ModelState = this;
			}

			IsValid = Errors.All(x => string.IsNullOrEmpty(x.Value));
		}
	}
}