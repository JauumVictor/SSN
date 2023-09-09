interface Data {
    user: {
        profile_url: string;
        follower_count: number;
        about: string;
        full_name: string;
        id: string;
        image_small_url: string;
        pin_count: number;
    };
    pins: Pin[];
}

interface Pin {
    attribution: string | null;
    aggregated_pin_data: {
        aggregated_stats: {
            saves: number;
            done: number;
        };
    };
    id: string;
    pinner: {
        profile_url: string;
        follower_count: number;
        about: string;
        full_name: string;
        id: string;
        image_small_url: string;
        pin_count: number;
    };
    images: {
        '237x': Image;
        '564x': Image;
    };
    dominant_color: string;
    domain: string;
    native_creator: {
        id: string;
    };
    description: string;
    story_pin_data: any | null;
    embed: any | null;
    is_video: boolean;
    link: string | null;
    repin_count: number;
}

interface Image {
    width: number;
    height: number;
    url: string;
}

export { Data, Image, Pin };