export interface Theme {
    id: string;
    name: string;
    description: string;
    author: string;

    primary: {
        dark: string;
        light: string;
        subtle: string;
    };
    button?: {
        primary?: {
            bg: string;
            text: string;
        };
        secondary?: {
            bg: string;
            text: string;
        };
        tertiary?: {
            bg: string;
            text: string;
        };
    };
}
