import { create } from "zustand";
import { persist } from "zustand/middleware";
import {
  type Product,
  type WeaverProfile,
  type Order,
  type YarnRequest,
  type OrderStatus,
  type NotificationLog,
  type VerificationStatus,
  mockProducts,
  mockWeavers,
  mockOrders,
  mockYarnRequests,
} from "./data";

interface DataState {
  products: Product[];
  weavers: WeaverProfile[];
  orders: Order[];
  yarnRequests: YarnRequest[];
  notificationLogs: NotificationLog[];

  addProduct: (product: Product) => void;
  addOrder: (order: Order) => void;
  addYarnRequest: (req: YarnRequest) => void;
  updateOrderStatus: (orderId: string, status: OrderStatus) => void;
  updateYarnRequestStatus: (reqId: string, status: YarnRequest["status"]) => void;
  updateWeaverStatus: (weaverId: string, status: VerificationStatus) => void;
  addNotificationLog: (log: Omit<NotificationLog, "id" | "timestamp">) => void;
  clearNotificationLogs: () => void;
  resetData: () => void;
}

export const useDataStore = create<DataState>()(
  persist(
    (set) => ({
      products: mockProducts,
      weavers: mockWeavers,
      orders: mockOrders,
      yarnRequests: mockYarnRequests,
      notificationLogs: [],

      addProduct: (product) =>
        set((state) => ({
          products: [product, ...state.products],
        })),

      addOrder: (order) =>
        set((state) => ({
          orders: [order, ...state.orders],
        })),

      addYarnRequest: (req) =>
        set((state) => ({
          yarnRequests: [req, ...state.yarnRequests],
        })),

      updateOrderStatus: (orderId, status) =>
        set((state) => ({
          orders: state.orders.map((o) =>
            o.orderId === orderId || o.id === orderId
              ? { ...o, status, updatedAt: new Date().toISOString().split("T")[0] }
              : o
          ),
        })),

      updateYarnRequestStatus: (reqId, status) =>
        set((state) => ({
          yarnRequests: state.yarnRequests.map((r) =>
            r.id === reqId ? { ...r, status } : r
          ),
        })),

      updateWeaverStatus: (weaverId, status) =>
        set((state) => ({
          weavers: state.weavers.map((w) =>
            w.id === weaverId || w.weaverId === weaverId ? { ...w, verificationStatus: status } : w
          ),
        })),

      addNotificationLog: (log) =>
        set((state) => ({
          notificationLogs: [
            {
              ...log,
              id: `log-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
              timestamp: new Date().toISOString(),
            },
            ...state.notificationLogs,
          ],
        })),

      clearNotificationLogs: () =>
        set({ notificationLogs: [] }),

      resetData: () =>
        set({
          products: mockProducts,
          weavers: mockWeavers,
          orders: mockOrders,
          yarnRequests: mockYarnRequests,
          notificationLogs: [],
        }),
    }),
    {
      name: "ikat-data-storage",
    }
  )
);
