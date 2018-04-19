import associationStoryWriterSchema from '@/schemas/caes_news/association_story_writer';
import associationStoryAudienceSchema from '@/schemas/caes_news/association_story_audience';
import associationStoryKeywordSchema from '@/schemas/caes_news/association_story_keyword';

const schema = {
	database: 'CAES_NEWS',
	table: 'STORY',
	columns: [
		{
			columnName: 'ID',
			type: 'int',
			immutable: true,
			prettyName: 'ID'
		},
		{
			columnName: 'LONG_TITLE',
			type: 'nvarchar',
			required: true
		},
		{
			columnName: 'SHORT_TITLE',
			type: 'nvarchar',
			required: true
		},
		{
			columnName: 'SHORT_TEASER',
			type: 'nvarchar',
			required: true
		},
		{
			columnName: 'BODY',
			type: 'nvarchar',
			required: true,
			inputType: 'richtext'
		},
		{
			columnName: 'LEAD_PARAGRAPH',
			type: 'ntext',
			required: true
		},
		{
			columnName: 'RELEASE_DATE',
			type: 'datetime',
			required: true
		},
		{
			columnName: 'STATUS_ID',
			type: 'int',
			required: true,
			constraint: {
				database: 'CAES_NEWS',
				table: 'STORY_STATUS',
				foreignKey: 'ID',
				values: []
			}
		},
		{
			columnName: 'OMITS_BYLINE',
			type: 'bit',
			required: true
		},
		{
			columnName: 'OMITS_TAGLINE',
			type: 'bit',
			required: true
		},
		{
			columnName: 'IS_FEATURED',
			type: 'bit',
			required: true
		},
		{
			columnName: 'STORY_PROOFER_ID',
			type: 'int',
			required: true,
			constraint: {
				database: 'CAES_NEWS',
				table: 'STORY_WRITER',
				foreignKey: 'ID',
				values: []
			}
		},
		{
			columnName: 'DATE_CREATED',
			type: 'datetime',
			required: true
		},
		{
			columnName: 'DATE_LAST_UPDATED',
			type: 'datetime',
			required: true
		}
	],
	associations: [
		{
			title: 'Writers',
			schema: associationStoryWriterSchema,
			localKey: 'ID',
			foreignKey: 'STORY_ID',
			isAssignable: true
		},
		{
			title: 'Audiences',
			schema: associationStoryAudienceSchema,
			localKey: 'ID',
			foreignKey: 'STORY_ID',
			associatedColumn: 'AUDIENCE_ID',
			multiSelect: true
		},
		{
			title: 'Keywords',
			schema: associationStoryKeywordSchema,
			localKey: 'ID',
			foreignKey: 'STORY_ID',
			associatedColumn: 'KEYWORD_ID',
			multiSelect: true,
			groupBy: 'TYPE_ID'
		}
	]
};

export default schema;
