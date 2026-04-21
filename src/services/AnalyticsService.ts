import { Between, type FindOptionsWhere } from 'typeorm';

import { dbSource } from '@/dbConfig';
import { Branch } from '@/entities/Branch';
import { Customer } from '@/entities/Customer';
import { Order, OrderStatus, PaymentStatus } from '@/entities/Order';
import { OrderItem } from '@/entities/OrderItem';

const parseYmdLocal = (ymd: string): Date => {
    const [y, m, d] = ymd.split('-').map(Number);
    return new Date(y, m - 1, d);
};

const startOfDay = (d: Date): Date => {
    const x = new Date(d);
    x.setHours(0, 0, 0, 0);
    return x;
};

const endOfDay = (d: Date): Date => {
    const x = new Date(d);
    x.setHours(23, 59, 59, 999);
    return x;
};

const addDaysLocal = (d: Date, n: number): Date => {
    const x = new Date(d);
    x.setDate(x.getDate() + n);
    return x;
};

export type AnalyticsPeriod = {
    start: Date;
    end: Date;
    fromYmd: string;
    toYmd: string;
};

/** Resolve optional `from` / `to` (`YYYY-MM-DD`). Defaults to last 30 days ending today (server local). */
export function resolveAnalyticsPeriod(fromStr?: string, toStr?: string): AnalyticsPeriod {
    const today = new Date();
    const end = toStr?.trim() ? endOfDay(parseYmdLocal(toStr.trim())) : endOfDay(today);
    const start = fromStr?.trim() ? startOfDay(parseYmdLocal(fromStr.trim())) : startOfDay(addDaysLocal(end, -29));
    if (start > end) {
        throw new Error('Invalid period: from must be on or before to');
    }
    const pad = (n: number) => String(n).padStart(2, '0');
    const fromYmd = `${start.getFullYear()}-${pad(start.getMonth() + 1)}-${pad(start.getDate())}`;
    const toYmd = `${end.getFullYear()}-${pad(end.getMonth() + 1)}-${pad(end.getDate())}`;
    return { start, end, fromYmd, toYmd };
}

export type RevenueDayRow = { date: string; orderCount: number; revenueInr: number };

export type TopLineRow = {
    id: string;
    name: string;
    quantity: number;
    revenueInr: number;
};

export type BranchBreakdownRow = {
    branchId: string;
    branchName: string;
    orderCount: number;
    revenueInr: number;
};

export class AnalyticsService {
    static async getOverview(params: { period: AnalyticsPeriod; branchId?: string }): Promise<{
        summary: {
            orderCount: number;
            cancelledOrderCount: number;
            revenueInr: number;
            averageOrderValueInr: number;
            paidOrderCount: number;
            pendingPaymentOrderCount: number;
            newCustomersCount: number;
        };
        orderStatusBreakdown: Partial<Record<OrderStatus, number>>;
        paymentStatusBreakdown: Partial<Record<PaymentStatus, number>>;
        revenueByDay: RevenueDayRow[];
        topProducts: TopLineRow[];
        topServices: TopLineRow[];
        branchBreakdown: BranchBreakdownRow[];
    }> {
        const { start, end } = params.period;
        const branchTrim = typeof params.branchId === 'string' ? params.branchId.trim() : '';

        const orderWhere = {
            isActive: true,
            createdAt: Between(start, end),
            ...(branchTrim ? { branchId: branchTrim } : {}),
        } satisfies FindOptionsWhere<Order>;
        const ordersInPeriod = await Order.find({
            where: orderWhere,
        });

        const orderCount = ordersInPeriod.length;
        const cancelledOrderCount = ordersInPeriod.filter(o => o.orderStatus === OrderStatus.CANCELLED).length;
        const nonCancelled = ordersInPeriod.filter(o => o.orderStatus !== OrderStatus.CANCELLED);

        let revenueInr = 0;
        for (const o of nonCancelled) {
            revenueInr += Number(o.totalAmount ?? 0);
        }
        revenueInr = Number(revenueInr.toFixed(2));

        const denom = Math.max(1, nonCancelled.length);
        const averageOrderValueInr = Number((revenueInr / denom).toFixed(2));

        const paidOrderCount = nonCancelled.filter(o => o.paymentStatus === PaymentStatus.PAID).length;
        const pendingPaymentOrderCount = nonCancelled.filter(o => o.paymentStatus === PaymentStatus.PENDING).length;

        const orderStatusBreakdown: Partial<Record<OrderStatus, number>> = {};
        for (const s of Object.values(OrderStatus)) orderStatusBreakdown[s] = 0;
        for (const o of ordersInPeriod) {
            orderStatusBreakdown[o.orderStatus] = (orderStatusBreakdown[o.orderStatus] ?? 0) + 1;
        }

        const paymentStatusBreakdown: Partial<Record<PaymentStatus, number>> = {};
        for (const s of Object.values(PaymentStatus)) paymentStatusBreakdown[s] = 0;
        for (const o of ordersInPeriod) {
            paymentStatusBreakdown[o.paymentStatus] = (paymentStatusBreakdown[o.paymentStatus] ?? 0) + 1;
        }

        const newCustomersCount = await dbSource.manager.count(Customer, {
            where: { isActive: true, createdAt: Between(start, end) },
        });

        let revenueQb = dbSource.manager
            .createQueryBuilder(Order, 'o')
            .select("DATE_TRUNC('day', o.createdAt)", 'day')
            .addSelect('COUNT(o.id)', 'orderCount')
            .addSelect(`COALESCE(SUM(CASE WHEN o.orderStatus != :cancelled THEN o.totalAmount ELSE 0 END), 0)`, 'revenueInr')
            .where('o.isActive = true')
            .andWhere('o.createdAt BETWEEN :start AND :end', { start, end })
            .setParameter('cancelled', OrderStatus.CANCELLED)
            .groupBy("DATE_TRUNC('day', o.createdAt)")
            .orderBy("DATE_TRUNC('day', o.createdAt)", 'ASC');

        if (branchTrim) {
            revenueQb = revenueQb.andWhere('o.branchId = :branchId', { branchId: branchTrim });
        }

        const revenueRows = await revenueQb.getRawMany<Record<string, unknown>>();
        const revenueByDay: RevenueDayRow[] = revenueRows.map(r => {
            const dayVal = r.day ?? r.DAY;
            const d = dayVal instanceof Date ? dayVal : new Date(String(dayVal));
            const y = d.getFullYear();
            const m = String(d.getMonth() + 1).padStart(2, '0');
            const dayNum = String(d.getDate()).padStart(2, '0');
            const oc = r.orderCount ?? r.ordercount;
            const rev = r.revenueInr ?? r.revenueinr;
            return {
                date: `${y}-${m}-${dayNum}`,
                orderCount: Number(oc),
                revenueInr: Number(Number(rev).toFixed(2)),
            };
        });

        let productQb = dbSource.manager
            .createQueryBuilder(OrderItem, 'i')
            .innerJoin('i.order', 'o')
            .innerJoin('i.product', 'p')
            .select('p.id', 'id')
            .addSelect('p.productName', 'name')
            .addSelect('SUM(i.quantity)', 'quantity')
            .addSelect('SUM(i.lineTotal)', 'revenueInr')
            .where('o.isActive = true')
            .andWhere('o.createdAt BETWEEN :start AND :end', { start, end })
            .andWhere('o.orderStatus != :cancelled', { cancelled: OrderStatus.CANCELLED })
            .groupBy('p.id')
            .addGroupBy('p.productName')
            .orderBy('SUM(i.lineTotal)', 'DESC')
            .take(10);

        if (branchTrim) {
            productQb = productQb.andWhere('o.branchId = :branchId', { branchId: branchTrim });
        }

        const productRaw = await productQb.getRawMany<Record<string, unknown>>();
        const topProducts: TopLineRow[] = productRaw.map(r => ({
            id: String(r.id),
            name: String(r.name ?? ''),
            quantity: Number(r.quantity),
            revenueInr: Number(Number(r.revenueInr ?? r.revenueinr).toFixed(2)),
        }));

        let serviceQb = dbSource.manager
            .createQueryBuilder(OrderItem, 'i')
            .innerJoin('i.order', 'o')
            .innerJoin('i.service', 's')
            .select('s.id', 'id')
            .addSelect('s.serviceName', 'name')
            .addSelect('SUM(i.quantity)', 'quantity')
            .addSelect('SUM(i.lineTotal)', 'revenueInr')
            .where('o.isActive = true')
            .andWhere('o.createdAt BETWEEN :start AND :end', { start, end })
            .andWhere('o.orderStatus != :cancelled', { cancelled: OrderStatus.CANCELLED })
            .groupBy('s.id')
            .addGroupBy('s.serviceName')
            .orderBy('SUM(i.lineTotal)', 'DESC')
            .take(10);

        if (branchTrim) {
            serviceQb = serviceQb.andWhere('o.branchId = :branchId', { branchId: branchTrim });
        }

        const serviceRaw = await serviceQb.getRawMany<Record<string, unknown>>();
        const topServices: TopLineRow[] = serviceRaw.map(r => ({
            id: String(r.id),
            name: String(r.name ?? ''),
            quantity: Number(r.quantity),
            revenueInr: Number(Number(r.revenueInr ?? r.revenueinr).toFixed(2)),
        }));

        let branchQb = dbSource.manager
            .createQueryBuilder(Order, 'o')
            .innerJoin(Branch, 'b', 'b.id = o.branchId')
            .select('b.id', 'branchId')
            .addSelect('b.branchName', 'branchName')
            .addSelect('COUNT(o.id)', 'orderCount')
            .addSelect(`COALESCE(SUM(CASE WHEN o.orderStatus != :cancelled THEN o.totalAmount ELSE 0 END), 0)`, 'revenueInr')
            .where('o.isActive = true')
            .andWhere('o.createdAt BETWEEN :start AND :end', { start, end })
            .setParameter('cancelled', OrderStatus.CANCELLED)
            .groupBy('b.id')
            .addGroupBy('b.branchName')
            .orderBy(`COALESCE(SUM(CASE WHEN o.orderStatus != :cancelled THEN o.totalAmount ELSE 0 END), 0)`, 'DESC');

        if (branchTrim) {
            branchQb = branchQb.andWhere('o.branchId = :branchId', { branchId: branchTrim });
        }

        const branchRaw = await branchQb.getRawMany<Record<string, unknown>>();
        const branchBreakdown: BranchBreakdownRow[] = branchRaw.map(r => ({
            branchId: String(r.branchId ?? r.branchid),
            branchName: String(r.branchName ?? r.branchname ?? ''),
            orderCount: Number(r.orderCount ?? r.ordercount),
            revenueInr: Number(Number(r.revenueInr ?? r.revenueinr).toFixed(2)),
        }));

        return {
            summary: {
                orderCount,
                cancelledOrderCount,
                revenueInr,
                averageOrderValueInr,
                paidOrderCount,
                pendingPaymentOrderCount,
                newCustomersCount,
            },
            orderStatusBreakdown,
            paymentStatusBreakdown,
            revenueByDay,
            topProducts,
            topServices,
            branchBreakdown,
        };
    }
}
