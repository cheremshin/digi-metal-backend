import { relations } from "drizzle-orm/relations";
import { userInUserManagement, clientRequestInUserManagement, userSessionInUserManagement, clientInfoInUserManagement, fileInFileStorage, materialCategoryInProductionFlow, materialInProductionFlow, equipmentSpecsInProductionFlow, equipmentInProductionFlow, technologicalMapInProductionFlow, productionTaskInSales, orderInSales, roleInUserManagement, rolePermissionInUserManagement, permissionInUserManagement, equipmentTaskTypeInProductionFlow, taskTypeInProductionFlow, technologicalMapEquipmentInProductionFlow, technologicalMapAttachmentInProductionFlow, orderTaskInSales, clientRequestFileInUserManagement, technologicalMapMaterialInProductionFlow, userRoleInUserManagement } from "./schema";

export const clientRequestInUserManagementRelations = relations(clientRequestInUserManagement, ({one, many}) => ({
	userInUserManagement_reviewedBy: one(userInUserManagement, {
		fields: [clientRequestInUserManagement.reviewedBy],
		references: [userInUserManagement.userId],
		relationName: "clientRequestInUserManagement_reviewedBy_userInUserManagement_userId"
	}),
	userInUserManagement_createdUserId: one(userInUserManagement, {
		fields: [clientRequestInUserManagement.createdUserId],
		references: [userInUserManagement.userId],
		relationName: "clientRequestInUserManagement_createdUserId_userInUserManagement_userId"
	}),
	clientRequestFileInUserManagements: many(clientRequestFileInUserManagement),
}));

export const userInUserManagementRelations = relations(userInUserManagement, ({many}) => ({
	clientRequestInUserManagements_reviewedBy: many(clientRequestInUserManagement, {
		relationName: "clientRequestInUserManagement_reviewedBy_userInUserManagement_userId"
	}),
	clientRequestInUserManagements_createdUserId: many(clientRequestInUserManagement, {
		relationName: "clientRequestInUserManagement_createdUserId_userInUserManagement_userId"
	}),
	userSessionInUserManagements: many(userSessionInUserManagement),
	clientInfoInUserManagements_userId: many(clientInfoInUserManagement, {
		relationName: "clientInfoInUserManagement_userId_userInUserManagement_userId"
	}),
	clientInfoInUserManagements_lastModifiedBy: many(clientInfoInUserManagement, {
		relationName: "clientInfoInUserManagement_lastModifiedBy_userInUserManagement_userId"
	}),
	fileInFileStorages: many(fileInFileStorage),
	materialInProductionFlows: many(materialInProductionFlow),
	equipmentSpecsInProductionFlows: many(equipmentSpecsInProductionFlow),
	equipmentInProductionFlows: many(equipmentInProductionFlow),
	technologicalMapInProductionFlows: many(technologicalMapInProductionFlow),
	productionTaskInSales_assignedTo: many(productionTaskInSales, {
		relationName: "productionTaskInSales_assignedTo_userInUserManagement_userId"
	}),
	productionTaskInSales_lastModifiedBy: many(productionTaskInSales, {
		relationName: "productionTaskInSales_lastModifiedBy_userInUserManagement_userId"
	}),
	orderInSales: many(orderInSales),
	userRoleInUserManagements_userId: many(userRoleInUserManagement, {
		relationName: "userRoleInUserManagement_userId_userInUserManagement_userId"
	}),
	userRoleInUserManagements_assignedBy: many(userRoleInUserManagement, {
		relationName: "userRoleInUserManagement_assignedBy_userInUserManagement_userId"
	}),
}));

export const userSessionInUserManagementRelations = relations(userSessionInUserManagement, ({one}) => ({
	userInUserManagement: one(userInUserManagement, {
		fields: [userSessionInUserManagement.userId],
		references: [userInUserManagement.userId]
	}),
}));

export const clientInfoInUserManagementRelations = relations(clientInfoInUserManagement, ({one, many}) => ({
	userInUserManagement_userId: one(userInUserManagement, {
		fields: [clientInfoInUserManagement.userId],
		references: [userInUserManagement.userId],
		relationName: "clientInfoInUserManagement_userId_userInUserManagement_userId"
	}),
	userInUserManagement_lastModifiedBy: one(userInUserManagement, {
		fields: [clientInfoInUserManagement.lastModifiedBy],
		references: [userInUserManagement.userId],
		relationName: "clientInfoInUserManagement_lastModifiedBy_userInUserManagement_userId"
	}),
	orderInSales: many(orderInSales),
}));

export const fileInFileStorageRelations = relations(fileInFileStorage, ({one, many}) => ({
	userInUserManagement: one(userInUserManagement, {
		fields: [fileInFileStorage.uploadedBy],
		references: [userInUserManagement.userId]
	}),
	technologicalMapAttachmentInProductionFlows: many(technologicalMapAttachmentInProductionFlow),
	clientRequestFileInUserManagements: many(clientRequestFileInUserManagement),
}));

export const materialInProductionFlowRelations = relations(materialInProductionFlow, ({one, many}) => ({
	materialCategoryInProductionFlow: one(materialCategoryInProductionFlow, {
		fields: [materialInProductionFlow.categoryId],
		references: [materialCategoryInProductionFlow.categoryId]
	}),
	userInUserManagement: one(userInUserManagement, {
		fields: [materialInProductionFlow.lastModifiedBy],
		references: [userInUserManagement.userId]
	}),
	technologicalMapMaterialInProductionFlows: many(technologicalMapMaterialInProductionFlow),
}));

export const materialCategoryInProductionFlowRelations = relations(materialCategoryInProductionFlow, ({many}) => ({
	materialInProductionFlows: many(materialInProductionFlow),
}));

export const equipmentSpecsInProductionFlowRelations = relations(equipmentSpecsInProductionFlow, ({one, many}) => ({
	userInUserManagement: one(userInUserManagement, {
		fields: [equipmentSpecsInProductionFlow.lastModifiedBy],
		references: [userInUserManagement.userId]
	}),
	equipmentInProductionFlows: many(equipmentInProductionFlow),
	equipmentTaskTypeInProductionFlows: many(equipmentTaskTypeInProductionFlow),
}));

export const equipmentInProductionFlowRelations = relations(equipmentInProductionFlow, ({one, many}) => ({
	equipmentSpecsInProductionFlow: one(equipmentSpecsInProductionFlow, {
		fields: [equipmentInProductionFlow.specsId],
		references: [equipmentSpecsInProductionFlow.specsId]
	}),
	userInUserManagement: one(userInUserManagement, {
		fields: [equipmentInProductionFlow.lastModifiedBy],
		references: [userInUserManagement.userId]
	}),
	technologicalMapEquipmentInProductionFlows: many(technologicalMapEquipmentInProductionFlow),
}));

export const technologicalMapInProductionFlowRelations = relations(technologicalMapInProductionFlow, ({one, many}) => ({
	userInUserManagement: one(userInUserManagement, {
		fields: [technologicalMapInProductionFlow.lastModifiedBy],
		references: [userInUserManagement.userId]
	}),
	productionTaskInSales: many(productionTaskInSales),
	technologicalMapEquipmentInProductionFlows: many(technologicalMapEquipmentInProductionFlow),
	technologicalMapAttachmentInProductionFlows: many(technologicalMapAttachmentInProductionFlow),
	technologicalMapMaterialInProductionFlows: many(technologicalMapMaterialInProductionFlow),
}));

export const productionTaskInSalesRelations = relations(productionTaskInSales, ({one, many}) => ({
	technologicalMapInProductionFlow: one(technologicalMapInProductionFlow, {
		fields: [productionTaskInSales.mapId],
		references: [technologicalMapInProductionFlow.mapId]
	}),
	userInUserManagement_assignedTo: one(userInUserManagement, {
		fields: [productionTaskInSales.assignedTo],
		references: [userInUserManagement.userId],
		relationName: "productionTaskInSales_assignedTo_userInUserManagement_userId"
	}),
	userInUserManagement_lastModifiedBy: one(userInUserManagement, {
		fields: [productionTaskInSales.lastModifiedBy],
		references: [userInUserManagement.userId],
		relationName: "productionTaskInSales_lastModifiedBy_userInUserManagement_userId"
	}),
	orderTaskInSales: many(orderTaskInSales),
}));

export const orderInSalesRelations = relations(orderInSales, ({one, many}) => ({
	clientInfoInUserManagement: one(clientInfoInUserManagement, {
		fields: [orderInSales.clientId],
		references: [clientInfoInUserManagement.clientId]
	}),
	userInUserManagement: one(userInUserManagement, {
		fields: [orderInSales.lastModifiedBy],
		references: [userInUserManagement.userId]
	}),
	orderTaskInSales: many(orderTaskInSales),
}));

export const rolePermissionInUserManagementRelations = relations(rolePermissionInUserManagement, ({one}) => ({
	roleInUserManagement: one(roleInUserManagement, {
		fields: [rolePermissionInUserManagement.roleId],
		references: [roleInUserManagement.roleId]
	}),
	permissionInUserManagement: one(permissionInUserManagement, {
		fields: [rolePermissionInUserManagement.permissionId],
		references: [permissionInUserManagement.permissionId]
	}),
}));

export const roleInUserManagementRelations = relations(roleInUserManagement, ({many}) => ({
	rolePermissionInUserManagements: many(rolePermissionInUserManagement),
	userRoleInUserManagements: many(userRoleInUserManagement),
}));

export const permissionInUserManagementRelations = relations(permissionInUserManagement, ({many}) => ({
	rolePermissionInUserManagements: many(rolePermissionInUserManagement),
}));

export const equipmentTaskTypeInProductionFlowRelations = relations(equipmentTaskTypeInProductionFlow, ({one}) => ({
	equipmentSpecsInProductionFlow: one(equipmentSpecsInProductionFlow, {
		fields: [equipmentTaskTypeInProductionFlow.specsId],
		references: [equipmentSpecsInProductionFlow.specsId]
	}),
	taskTypeInProductionFlow: one(taskTypeInProductionFlow, {
		fields: [equipmentTaskTypeInProductionFlow.taskTypeId],
		references: [taskTypeInProductionFlow.taskTypeId]
	}),
}));

export const taskTypeInProductionFlowRelations = relations(taskTypeInProductionFlow, ({many}) => ({
	equipmentTaskTypeInProductionFlows: many(equipmentTaskTypeInProductionFlow),
}));

export const technologicalMapEquipmentInProductionFlowRelations = relations(technologicalMapEquipmentInProductionFlow, ({one}) => ({
	technologicalMapInProductionFlow: one(technologicalMapInProductionFlow, {
		fields: [technologicalMapEquipmentInProductionFlow.mapId],
		references: [technologicalMapInProductionFlow.mapId]
	}),
	equipmentInProductionFlow: one(equipmentInProductionFlow, {
		fields: [technologicalMapEquipmentInProductionFlow.equipmentId],
		references: [equipmentInProductionFlow.equipmentId]
	}),
}));

export const technologicalMapAttachmentInProductionFlowRelations = relations(technologicalMapAttachmentInProductionFlow, ({one}) => ({
	technologicalMapInProductionFlow: one(technologicalMapInProductionFlow, {
		fields: [technologicalMapAttachmentInProductionFlow.mapId],
		references: [technologicalMapInProductionFlow.mapId]
	}),
	fileInFileStorage: one(fileInFileStorage, {
		fields: [technologicalMapAttachmentInProductionFlow.fileId],
		references: [fileInFileStorage.fileId]
	}),
}));

export const orderTaskInSalesRelations = relations(orderTaskInSales, ({one}) => ({
	orderInSale: one(orderInSales, {
		fields: [orderTaskInSales.orderId],
		references: [orderInSales.orderId]
	}),
	productionTaskInSale: one(productionTaskInSales, {
		fields: [orderTaskInSales.taskId],
		references: [productionTaskInSales.taskId]
	}),
}));

export const clientRequestFileInUserManagementRelations = relations(clientRequestFileInUserManagement, ({one}) => ({
	clientRequestInUserManagement: one(clientRequestInUserManagement, {
		fields: [clientRequestFileInUserManagement.requestId],
		references: [clientRequestInUserManagement.requestId]
	}),
	fileInFileStorage: one(fileInFileStorage, {
		fields: [clientRequestFileInUserManagement.fileId],
		references: [fileInFileStorage.fileId]
	}),
}));

export const technologicalMapMaterialInProductionFlowRelations = relations(technologicalMapMaterialInProductionFlow, ({one}) => ({
	technologicalMapInProductionFlow: one(technologicalMapInProductionFlow, {
		fields: [technologicalMapMaterialInProductionFlow.mapId],
		references: [technologicalMapInProductionFlow.mapId]
	}),
	materialInProductionFlow: one(materialInProductionFlow, {
		fields: [technologicalMapMaterialInProductionFlow.materialId],
		references: [materialInProductionFlow.materialId]
	}),
}));

export const userRoleInUserManagementRelations = relations(userRoleInUserManagement, ({one}) => ({
	userInUserManagement_userId: one(userInUserManagement, {
		fields: [userRoleInUserManagement.userId],
		references: [userInUserManagement.userId],
		relationName: "userRoleInUserManagement_userId_userInUserManagement_userId"
	}),
	roleInUserManagement: one(roleInUserManagement, {
		fields: [userRoleInUserManagement.roleId],
		references: [roleInUserManagement.roleId]
	}),
	userInUserManagement_assignedBy: one(userInUserManagement, {
		fields: [userRoleInUserManagement.assignedBy],
		references: [userInUserManagement.userId],
		relationName: "userRoleInUserManagement_assignedBy_userInUserManagement_userId"
	}),
}));