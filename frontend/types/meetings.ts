export interface Participant {
    id: number;
    name: string;
    email: string;
}

export interface Topic {
    id: number;
    title: string;
    summary: string;
    start_time: number;
    end_time: number;
}

export interface ActionItem {
    id: number;
    task: string;
    completed: boolean;
}

export interface Transcript {
    id: number;
    speaker: string;
    text: string;
    start_time: number;
    end_time: number;
}

export interface Meeting {
    id: number;
    title: string;
    date: string;
    duration: number;
    media_url: string;
    summary: string;

    participants: Participant[];
    topics: Topic[];
    action_items: ActionItem[];
    transcripts: Transcript[];
}