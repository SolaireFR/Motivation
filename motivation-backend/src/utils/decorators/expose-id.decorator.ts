import { Transform } from 'class-transformer';

export const ExposeId = () => {
    return function (target: object, propertyKey: string): void {
        Transform(({ obj }: { obj: { _id?: unknown } }) => obj['_id'])(target, propertyKey);
    };
};
