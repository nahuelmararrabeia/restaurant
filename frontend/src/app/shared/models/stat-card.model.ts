import { StatCardColor } from "./stat-card-color";

export interface StatCard {

    title: string;

    value: string | number;

    icon: string;

    color?: StatCardColor;

}