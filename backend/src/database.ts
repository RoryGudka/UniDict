import { DynamoDB, ReturnValue } from "@aws-sdk/client-dynamodb";
import { marshall, unmarshall } from "@aws-sdk/util-dynamodb";

export const dynamoDB = new DynamoDB({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
  },
});

export async function getItem<T>(params: {
  tableName: string;
  key: Record<string, any>;
}): Promise<T | null> {
  const { Item } = await dynamoDB.getItem({
    TableName: params.tableName,
    Key: marshall(params.key),
  });

  return Item ? (unmarshall(Item) as T) : null;
}

export async function putItem<T extends Record<string, any>>(params: {
  tableName: string;
  item: T;
}): Promise<void> {
  await dynamoDB.putItem({
    TableName: params.tableName,
    Item: marshall(params.item),
  });
}

export async function updateItem<T>(params: {
  tableName: string;
  key: Record<string, any>;
  updateExpression: string;
  expressionAttributeValues?: Record<string, any>;
  expressionAttributeNames?: Record<string, string>;
  returnValues?: string;
}): Promise<T | null> {
  const { Attributes } = await dynamoDB.updateItem({
    TableName: params.tableName,
    Key: marshall(params.key),
    UpdateExpression: params.updateExpression,
    ExpressionAttributeValues: params.expressionAttributeValues
      ? marshall(params.expressionAttributeValues)
      : undefined,
    ExpressionAttributeNames: params.expressionAttributeNames,
    ReturnValues: params.returnValues as ReturnValue,
  });

  return Attributes ? (unmarshall(Attributes) as T) : null;
}

export async function deleteItem(params: {
  tableName: string;
  key: Record<string, any>;
}): Promise<void> {
  await dynamoDB.deleteItem({
    TableName: params.tableName,
    Key: marshall(params.key),
  });
}

export async function queryItems<T>(params: {
  tableName: string;
  keyConditionExpression: string;
  expressionAttributeValues?: Record<string, any>;
  expressionAttributeNames?: Record<string, string>;
  filterExpression?: string;
  limit?: number;
}): Promise<T[]> {
  const { Items = [] } = await dynamoDB.query({
    TableName: params.tableName,
    KeyConditionExpression: params.keyConditionExpression,
    ExpressionAttributeValues: params.expressionAttributeValues
      ? marshall(params.expressionAttributeValues)
      : undefined,
    ExpressionAttributeNames: params.expressionAttributeNames,
    FilterExpression: params.filterExpression,
    Limit: params.limit,
  });

  return Items.map((item) => unmarshall(item)) as T[];
}
