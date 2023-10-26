export namespace Core.Syntax.Token {
	export class VariableTokens {
		public static VALUE_DECLARE: string[] = ['=', ':'];
		public static DATATYPE_DECLARE: string[] = ['?'];
		public static INTERPOLATION_OPEN: string[] = ['{'];
		public static INTERPOLATION_CLOSE: string[] = ['}'];
		public static VISIBILITY_KEYWORDS = {
			public: "Public",
			protected: "Protected",
			inherited: "Inherited",
			private: "Private",
			restricted: "Restricted",
		};
	}
}