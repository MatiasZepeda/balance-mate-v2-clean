// Emotion data structure: 3-level hierarchy (7 → 41 → 82 emotions)
// Level 1: Primary emotions
// Level 2: Secondary emotions (specific to each primary)
// Level 3: Tertiary emotions (specific to each secondary)

window.emotions = {
    1: [
        {name: 'Happy', color: '#FFE5B4'},
        {name: 'Sad', color: '#B4D4FF'},
        {name: 'Angry', color: '#FFB4B4'},
        {name: 'Disgusted', color: '#C7E9C0'},
        {name: 'Fearful', color: '#E8D5C4'},
        {name: 'Bad', color: '#D4C5E2'},
        {name: 'Surprised', color: '#FFE5CC'}
    ],
    2: {
        'Happy': [
            {name: 'Playful', color: '#FFE5B4'}, {name: 'Content', color: '#B4D4FF'}, {name: 'Interested', color: '#FFB4B4'}, {name: 'Proud', color: '#C7E9C0'}, {name: 'Accepted', color: '#E8D5C4'}, {name: 'Powerful', color: '#D4C5E2'}, {name: 'Peaceful', color: '#FFE5CC'}, {name: 'Trusting', color: '#FFE5B4'}, {name: 'Optimistic', color: '#B4D4FF'}
        ],
        'Sad': [{name: 'Lonely', color: '#FFB4B4'}, {name: 'Vulnerable', color: '#C7E9C0'}, {name: 'Despair', color: '#E8D5C4'}, {name: 'Depressed', color: '#D4C5E2'}, {name: 'Hurt', color: '#FFE5CC'}, {name: 'Guilty', color: '#FFE5B4'}],
        'Angry': [{name: 'Let down', color: '#B4D4FF'}, {name: 'Humiliated', color: '#FFB4B4'}, {name: 'Bitter', color: '#C7E9C0'}, {name: 'Mad', color: '#E8D5C4'}, {name: 'Aggressive', color: '#D4C5E2'}, {name: 'Frustrated', color: '#FFE5CC'}, {name: 'Distant', color: '#FFE5B4'}, {name: 'Critical', color: '#B4D4FF'}],
        'Disgusted': [{name: 'Disapproving', color: '#FFB4B4'}, {name: 'Disappointed', color: '#C7E9C0'}, {name: 'Awful', color: '#E8D5C4'}, {name: 'Repelled', color: '#D4C5E2'}],
        'Fearful': [{name: 'Scared', color: '#FFE5CC'}, {name: 'Anxious', color: '#FFE5B4'}, {name: 'Insecure', color: '#B4D4FF'}, {name: 'Weak', color: '#FFB4B4'}, {name: 'Rejected', color: '#C7E9C0'}, {name: 'Threatened', color: '#E8D5C4'}],
        'Bad': [{name: 'Bored', color: '#D4C5E2'}, {name: 'Busy', color: '#FFE5CC'}, {name: 'Stressed', color: '#FFE5B4'}, {name: 'Tired', color: '#B4D4FF'}],
        'Surprised': [{name: 'Startled', color: '#FFB4B4'}, {name: 'Confused', color: '#C7E9C0'}, {name: 'Amazed', color: '#E8D5C4'}, {name: 'Excited', color: '#D4C5E2'}]
    },
    3: {
        'Playful': [{name: 'Aroused', color: '#FFE5B4'}, {name: 'Cheeky', color: '#B4D4FF'}],
        'Content': [{name: 'Free', color: '#FFB4B4'}, {name: 'Joyful', color: '#C7E9C0'}],
        'Interested': [{name: 'Curious', color: '#E8D5C4'}, {name: 'Inquisitive', color: '#D4C5E2'}],
        'Proud': [{name: 'Successful', color: '#FFE5CC'}, {name: 'Confident', color: '#FFE5B4'}],
        'Accepted': [{name: 'Respected', color: '#B4D4FF'}, {name: 'Valued', color: '#FFB4B4'}],
        'Powerful': [{name: 'Courageous', color: '#C7E9C0'}, {name: 'Creative', color: '#E8D5C4'}],
        'Peaceful': [{name: 'Loving', color: '#D4C5E2'}, {name: 'Thankful', color: '#FFE5CC'}],
        'Trusting': [{name: 'Sensitive', color: '#FFE5B4'}, {name: 'Intimate', color: '#B4D4FF'}],
        'Optimistic': [{name: 'Hopeful', color: '#FFB4B4'}, {name: 'Inspired', color: '#C7E9C0'}],
        'Lonely': [{name: 'Isolated', color: '#E8D5C4'}, {name: 'Abandoned', color: '#D4C5E2'}],
        'Vulnerable': [{name: 'Victimized', color: '#FFE5CC'}, {name: 'Fragile', color: '#FFE5B4'}],
        'Despair': [{name: 'Grief', color: '#B4D4FF'}, {name: 'Powerless', color: '#FFB4B4'}],
        'Depressed': [{name: 'Inferior', color: '#C7E9C0'}, {name: 'Empty', color: '#E8D5C4'}],
        'Hurt': [{name: 'Embarrassed', color: '#D4C5E2'}, {name: 'Disappointed', color: '#FFE5CC'}],
        'Guilty': [{name: 'Remorseful', color: '#FFE5B4'}, {name: 'Ashamed', color: '#B4D4FF'}],
        'Let down': [{name: 'Betrayed', color: '#FFB4B4'}, {name: 'Resentful', color: '#C7E9C0'}],
        'Humiliated': [{name: 'Disrespected', color: '#E8D5C4'}, {name: 'Ridiculed', color: '#D4C5E2'}],
        'Bitter': [{name: 'Indignant', color: '#FFE5CC'}, {name: 'Violated', color: '#FFE5B4'}],
        'Mad': [{name: 'Furious', color: '#B4D4FF'}, {name: 'Jealous', color: '#FFB4B4'}],
        'Aggressive': [{name: 'Provoked', color: '#C7E9C0'}, {name: 'Hostile', color: '#E8D5C4'}],
        'Frustrated': [{name: 'Infuriated', color: '#D4C5E2'}, {name: 'Annoyed', color: '#FFE5CC'}],
        'Distant': [{name: 'Withdrawn', color: '#FFE5B4'}, {name: 'Numb', color: '#B4D4FF'}],
        'Critical': [{name: 'Skeptical', color: '#FFB4B4'}, {name: 'Dismissive', color: '#C7E9C0'}],
        'Disapproving': [{name: 'Judgmental', color: '#E8D5C4'}, {name: 'Embarrassed', color: '#D4C5E2'}],
        'Disappointed': [{name: 'Appalled', color: '#FFE5CC'}, {name: 'Revolted', color: '#FFE5B4'}],
        'Awful': [{name: 'Nauseated', color: '#B4D4FF'}, {name: 'Detestable', color: '#FFB4B4'}],
        'Repelled': [{name: 'Horrified', color: '#C7E9C0'}, {name: 'Hesitant', color: '#E8D5C4'}],
        'Scared': [{name: 'Helpless', color: '#D4C5E2'}, {name: 'Frightened', color: '#FFE5CC'}],
        'Anxious': [{name: 'Overwhelmed', color: '#FFE5B4'}, {name: 'Worried', color: '#B4D4FF'}],
        'Insecure': [{name: 'Inferior', color: '#FFB4B4'}, {name: 'Inadequate', color: '#C7E9C0'}],
        'Weak': [{name: 'Worthy', color: '#E8D5C4'}, {name: 'Insignificant', color: '#D4C5E2'}],
        'Rejected': [{name: 'Excluded', color: '#FFE5CC'}, {name: 'Persecuted', color: '#FFE5B4'}],
        'Threatened': [{name: 'Nervous', color: '#B4D4FF'}, {name: 'Exposed', color: '#FFB4B4'}],
        'Bored': [{name: 'Indifferent', color: '#C7E9C0'}, {name: 'Apathetic', color: '#E8D5C4'}],
        'Busy': [{name: 'Pressured', color: '#D4C5E2'}, {name: 'Rushed', color: '#FFE5CC'}],
        'Stressed': [{name: 'Overwhelmed', color: '#FFE5B4'}, {name: 'Out of control', color: '#B4D4FF'}],
        'Tired': [{name: 'Sleepy', color: '#FFB4B4'}, {name: 'Unfocused', color: '#C7E9C0'}],
        'Startled': [{name: 'Shocked', color: '#E8D5C4'}, {name: 'Dismayed', color: '#D4C5E2'}],
        'Confused': [{name: 'Disillusioned', color: '#FFE5CC'}, {name: 'Perplexed', color: '#FFE5B4'}],
        'Amazed': [{name: 'Astonished', color: '#B4D4FF'}, {name: 'Awe', color: '#FFB4B4'}],
        'Excited': [{name: 'Eager', color: '#C7E9C0'}, {name: 'Energetic', color: '#E8D5C4'}]
    }
};
