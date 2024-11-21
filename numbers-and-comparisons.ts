type N0 = [];
type N1 = { ___v: 1 };

type Sum<A, B> = A extends N0
    ? B
    : B extends N0
        ? A
        : [A, B];

type N2 = Sum<N1, N1>;
type N3 = Sum<N2, N1>;
type N4 = Sum<N2, N2>;
type N5 = Sum<N4, N1>;

type TestSumN0N0 = Sum<N0, N0>;
type TestSumN0N1 = Sum<N0, N1>;
type TestSumN1N0 = Sum<N1, N0>;

type Dec<N> =
    N extends [N1, infer B]
        ? B
        : N extends [infer A, N1]
            ? A
            : N extends [infer A, infer B]
                ? [Dec<A>, B]
                : N extends N1
                    ? N0
                    : never;

type D3 = Dec<N4>;
type D2 = Dec<D3>;
type D1 = Dec<D2>;
type D0 = Dec<D1>;

type Sub<A, B> = Dec<B> extends never
    ? A
    : Sub<Dec<A>, Dec<B>>;

type Mul<A, B, R = A> = B extends N0
    ? N0
    : B extends N1
        ? R
        : Mul<A, Dec<B>, Sum<A, R>>;

type TestMul0 = Mul<N0, N0>;
type TestMul1 = Mul<N1, N1>;

type N10 = Mul<N5, N2>;
type N100 = Mul<N10, N10>;

type NumberToString<V extends number> = `${V}`;

type ReverseString<V extends string> = V extends `${infer H}${infer R}`
    ? R extends ''
        ? V
        : `${ReverseString<R>}${H}`
    : never;

type DigitIntoNs<V extends string> = V extends '0'
    ? N0
    : V extends '1'
        ? N1
        : V extends '2'
            ? N2
            : V extends '3'
                ? N3
                : V extends '4'
                    ? N4
                    : V extends '5'
                        ? N5
                        : V extends '6'
                            ? Sum<N5, N1>
                            : V extends '7'
                                ? Sum<N5, N2>
                                : V extends '8'
                                    ? Sum<N5, N3>
                                    : V extends '9'
                                        ? Sum<N5, N4>
                                        : never;

type ScaleBase<B> = B extends N1
    ? N10
    : Mul<B, N10>;

type ParseString<V extends string, C = N0, B = N1> =
    V extends ''
    ? C
    : V extends `${infer H}${infer R}`
        ? ParseString<R, Sum<C, Mul<DigitIntoNs<H>, B>>, ScaleBase<B>>
        : never;

type IntoNs<V extends number> = ParseString<
    ReverseString<NumberToString<V>>
>;

type TestNs = IntoNs<3>;

type NEquals<A, B> = A extends B ? true : false;

type TestNEqualsN0N1 = NEquals<N0, N1>;
type TestNEqualsN1N1 = NEquals<N1, N1>;
type TestNEqualsN2N2 = NEquals<N2, N2>;

type NGt<A, B> = Sub<A, B> extends never
    ? false
    : true;

type TestN10GtN5 = NGt<N10, N5>;
type TestN5GtN10 = NGt<N5, N10>;

type NLt<A, B> = NGt<B, A>;

type TestN10LtN5 = NLt<N10, N5>;
type TestN5LtN10 = NLt<N5, N10>;

type NGte<A, B> = A extends B
    ? true
    : NGt<A, B>;
type NLte<A, B> = NGte<B, A>;

type And<A, B> = A extends true
    ? B extends true
        ? true
        : false
    : false;

type InRange<Value extends number, Min extends number, Max extends number>
    = And<NGte<IntoNs<Value>, IntoNs<Min>>, NLte<IntoNs<Value>, IntoNs<Max>>>;

type Percent<V extends number> = InRange<V, 0, 100> extends true
    ? V
    : 'Not a valid percent (%)';

function times<const B extends number>(a: number, b: Percent<B>) {

}

times(10, 100);
times(3, 300);
