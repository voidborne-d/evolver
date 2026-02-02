const { program } = require('commander');
const Lark = require('@larksuiteoapi/node-sdk');
require('dotenv').config({ path: require('path').resolve(__dirname, '../../.env') });

const APP_ID = process.env.FEISHU_APP_ID;
const APP_SECRET = process.env.FEISHU_APP_SECRET;

if (!APP_ID || !APP_SECRET) {
    console.error('Error: FEISHU_APP_ID or FEISHU_APP_SECRET not set.');
    process.exit(1);
}

const client = new Lark.Client({
    appId: APP_ID,
    appSecret: APP_SECRET,
});

program
    .requiredOption('--summary <text>', 'Task Title')
    .option('--desc <text>', 'Task Description')
    .option('--due <time>', 'Due time (YYYY-MM-DD HH:mm)')
    .option('--assignees <ids>', 'Comma-separated OpenIDs of executors')
    .option('--origin <text>', 'Origin info (optional)')
    .parse(process.argv);

const options = program.opts();

async function createTask() {
    try {
        // 1. Create Task
        const taskData = {
            summary: options.summary,
            description: options.desc || '',
            origin: {
                platform_i18n_name: JSON.stringify({ "zh_cn": "OpenClaw Assistant", "en_us": "OpenClaw Assistant" }),
                href: {
                    url: options.origin || "https://open.feishu.cn",
                    title: options.summary
                }
            }
        };

        if (options.due) {
            const dueTs = Math.floor(new Date(options.due).getTime() / 1000);
            if (!isNaN(dueTs)) {
                taskData.due = {
                    time: String(dueTs),
                    timezone: 'Asia/Shanghai',
                    is_all_day: false
                };
            }
        }

        console.log(`Creating task: "${options.summary}"...`);
        const createRes = await client.task.task.create({
            data: taskData
        });

        if (createRes.code !== 0) {
            console.error(`❌ Failed to create task: ${createRes.msg}`);
            process.exit(1);
        }

        const task = createRes.data.task;
        const taskId = task.id;
        console.log(`✅ Task Created: ${taskId}`);
        console.log(`   Link: ${task.app_link}`);

        // 2. Add Assignees (Collaborators)
        if (options.assignees) {
            const assignees = options.assignees.split(',').map(s => s.trim()).filter(s => s);
            for (const userId of assignees) {
                console.log(`   Adding assignee: ${userId}...`);
                const collabRes = await client.task.taskCollaborator.create({
                    path: {
                        task_id: taskId
                    },
                    params: {
                        user_id_type: 'open_id'
                    },
                    data: {
                        id: userId
                    }
                });
                
                if (collabRes.code !== 0) {
                    console.error(`   ❌ Failed to add ${userId}: ${collabRes.msg}`);
                }
            }
        }
        
        console.log(`🎉 Task Setup Complete!`);

    } catch (e) {
        console.error('Error:', e.message);
        if (e.response) console.error('Data:', JSON.stringify(e.response.data));
    }
}

createTask();
