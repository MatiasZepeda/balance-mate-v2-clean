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
            {name: 'Playful', color: '#FFD700'}, {name: 'Content', color: '#F0E68C'}, {name: 'Interested', color: '#FAFAD2'}, {name: 'Proud', color: '#FFE4B5'}, {name: 'Accepted', color: '#FFEFD5'}, {name: 'Powerful', color: '#FFE5B4'}, {name: 'Peaceful', color: '#FFF8DC'}, {name: 'Trusting', color: '#FFFACD'}, {name: 'Optimistic', color: '#FFFFE0'}
        ],
        'Sad': [{name: 'Lonely', color: '#87CEEB'}, {name: 'Vulnerable', color: '#87CEFA'}, {name: 'Despair', color: '#ADD8E6'}, {name: 'Depressed', color: '#B0C4DE'}, {name: 'Hurt', color: '#B0E0E6'}, {name: 'Guilty', color: '#AFEEEE'}],
        'Angry': [{name: 'Let down', color: '#FA8072'}, {name: 'Humiliated', color: '#FF6347'}, {name: 'Bitter', color: '#FF7F50'}, {name: 'Mad', color: '#FF8C69'}, {name: 'Aggressive', color: '#FFA07A'}, {name: 'Frustrated', color: '#FFB6C1'}, {name: 'Distant', color: '#FFC0CB'}, {name: 'Critical', color: '#FFD1DC'}],
        'Disgusted': [{name: 'Disapproving', color: '#90EE90'}, {name: 'Disappointed', color: '#98FB98'}, {name: 'Awful', color: '#8FBC8F'}, {name: 'Repelled', color: '#9ACD32'}],
        'Fearful': [{name: 'Scared', color: '#DEB887'}, {name: 'Anxious', color: '#D2B48C'}, {name: 'Insecure', color: '#BC8F8F'}, {name: 'Weak', color: '#F4A460'}, {name: 'Rejected', color: '#DAA520'}, {name: 'Threatened', color: '#B8860B'}],
        'Bad': [{name: 'Bored', color: '#DDA0DD'}, {name: 'Busy', color: '#EE82EE'}, {name: 'Stressed', color: '#DA70D6'}, {name: 'Tired', color: '#BA55D3'}],
        'Surprised': [{name: 'Startled', color: '#FFDAB9'}, {name: 'Confused', color: '#FFDEAD'}, {name: 'Amazed', color: '#FFE4C4'}, {name: 'Excited', color: '#FFEBCD'}]
    },
    3: {
        'Playful': [{name: 'Aroused', color: '#FFD700'}, {name: 'Cheeky', color: '#FFC700'}],
        'Content': [{name: 'Free', color: '#F0E68C'}, {name: 'Joyful', color: '#E0D67C'}],
        'Interested': [{name: 'Curious', color: '#FAFAD2'}, {name: 'Inquisitive', color: '#EAEAD2'}],
        'Proud': [{name: 'Successful', color: '#FFE4B5'}, {name: 'Confident', color: '#EED4A5'}],
        'Accepted': [{name: 'Respected', color: '#FFEFD5'}, {name: 'Valued', color: '#EEDFC5'}],
        'Powerful': [{name: 'Courageous', color: '#FFE5B4'}, {name: 'Creative', color: '#EED5A4'}],
        'Peaceful': [{name: 'Loving', color: '#FFF8DC'}, {name: 'Thankful', color: '#EEE8CC'}],
        'Trusting': [{name: 'Sensitive', color: '#FFFACD'}, {name: 'Intimate', color: '#EEEABD'}],
        'Optimistic': [{name: 'Hopeful', color: '#FFFFE0'}, {name: 'Inspired', color: '#EEEED0'}],
        'Lonely': [{name: 'Isolated', color: '#87CEEB'}, {name: 'Abandoned', color: '#77BEDB'}],
        'Vulnerable': [{name: 'Victimized', color: '#87CEFA'}, {name: 'Fragile', color: '#77BEEA'}],
        'Despair': [{name: 'Grief', color: '#ADD8E6'}, {name: 'Powerless', color: '#9DC8D6'}],
        'Depressed': [{name: 'Inferior', color: '#B0C4DE'}, {name: 'Empty', color: '#A0B4CE'}],
        'Hurt': [{name: 'Embarrassed', color: '#B0E0E6'}, {name: 'Disappointed', color: '#A0D0D6'}],
        'Guilty': [{name: 'Remorseful', color: '#AFEEEE'}, {name: 'Ashamed', color: '#9FDEDE'}],
        'Let down': [{name: 'Betrayed', color: '#FA8072'}, {name: 'Resentful', color: '#EA7062'}],
        'Humiliated': [{name: 'Disrespected', color: '#FF6347'}, {name: 'Ridiculed', color: '#EF5337'}],
        'Bitter': [{name: 'Indignant', color: '#FF7F50'}, {name: 'Violated', color: '#EF6F40'}],
        'Mad': [{name: 'Furious', color: '#FF8C69'}, {name: 'Jealous', color: '#EF7C59'}],
        'Aggressive': [{name: 'Provoked', color: '#FFA07A'}, {name: 'Hostile', color: '#EF906A'}],
        'Frustrated': [{name: 'Infuriated', color: '#FFB6C1'}, {name: 'Annoyed', color: '#EFA6B1'}],
        'Distant': [{name: 'Withdrawn', color: '#FFC0CB'}, {name: 'Numb', color: '#EFB0BB'}],
        'Critical': [{name: 'Skeptical', color: '#FFD1DC'}, {name: 'Dismissive', color: '#EFC1CC'}],
        'Disapproving': [{name: 'Judgmental', color: '#90EE90'}, {name: 'Embarrassed', color: '#80DE80'}],
        'Disappointed': [{name: 'Appalled', color: '#98FB98'}, {name: 'Revolted', color: '#88EB88'}],
        'Awful': [{name: 'Nauseated', color: '#8FBC8F'}, {name: 'Detestable', color: '#7FAC7F'}],
        'Repelled': [{name: 'Horrified', color: '#9ACD32'}, {name: 'Hesitant', color: '#8ABD22'}],
        'Scared': [{name: 'Helpless', color: '#DEB887'}, {name: 'Frightened', color: '#CEA877'}],
        'Anxious': [{name: 'Overwhelmed', color: '#D2B48C'}, {name: 'Worried', color: '#C2A47C'}],
        'Insecure': [{name: 'Inferior', color: '#BC8F8F'}, {name: 'Inadequate', color: '#AC7F7F'}],
        'Weak': [{name: 'Worthy', color: '#F4A460'}, {name: 'Insignificant', color: '#E49450'}],
        'Rejected': [{name: 'Excluded', color: '#DAA520'}, {name: 'Persecuted', color: '#CA9510'}],
        'Threatened': [{name: 'Nervous', color: '#B8860B'}, {name: 'Exposed', color: '#A87600'}],
        'Bored': [{name: 'Indifferent', color: '#DDA0DD'}, {name: 'Apathetic', color: '#CD90CD'}],
        'Busy': [{name: 'Pressured', color: '#EE82EE'}, {name: 'Rushed', color: '#DE72DE'}],
        'Stressed': [{name: 'Overwhelmed', color: '#DA70D6'}, {name: 'Out of control', color: '#CA60C6'}],
        'Tired': [{name: 'Sleepy', color: '#BA55D3'}, {name: 'Unfocused', color: '#AA45C3'}],
        'Startled': [{name: 'Shocked', color: '#FFDAB9'}, {name: 'Dismayed', color: '#EFCAA9'}],
        'Confused': [{name: 'Disillusioned', color: '#FFDEAD'}, {name: 'Perplexed', color: '#EFCE9D'}],
        'Amazed': [{name: 'Astonished', color: '#FFE4C4'}, {name: 'Awe', color: '#EED4B4'}],
        'Excited': [{name: 'Eager', color: '#FFEBCD'}, {name: 'Energetic', color: '#EEDBBD'}]
    }
};
