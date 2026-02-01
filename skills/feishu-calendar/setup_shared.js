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
    .option('--calendar <id>', 'Bot Calendar ID (Optional)')
    .option('--master <id>', 'Master OpenID (Required)', 'ou_cdc63fe05e88c580aedead04d851fc04')
    .parse(process.argv);

const options = program.opts();

async function setupSharedCalendar() {
    try {
        let botCalendarId = options.calendar;

        // 1. Get/Create Bot Calendar "OpenClaw Assistant"
        if (!botCalendarId) {
            console.log('🔍 Locating "OpenClaw Assistant" calendar...');
            const calList = await client.calendar.calendar.list();
            if (calList.code === 0 && calList.data.calendar_list) {
                const existing = calList.data.calendar_list.find(c => c.summary === 'OpenClaw Assistant');
                if (existing) {
                    botCalendarId = existing.calendar_id;
                    console.log(`✅ Found existing: ${botCalendarId}`);
                }
            }
        }

        if (!botCalendarId) {
            console.log('🆕 Creating new "OpenClaw Assistant" calendar...');
            const res = await client.request({
                method: 'POST',
                url: '/open-apis/calendar/v4/calendars',
                data: {
                    summary: 'OpenClaw Assistant',
                    description: 'Calendar for AI Agent tasks and events.',
                    permissions: 'public', // Set to public to simplify initial access
                    color: -1,
                    summary_alias: 'OpenClaw'
                }
            });
            if (res.code === 0) {
                botCalendarId = res.data.calendar.calendar_id;
                console.log(`✅ Created: ${botCalendarId}`);
            } else {
                console.error(`❌ Failed to create bot calendar: ${res.msg}`);
                process.exit(1);
            }
        }

        // 2. Add Master as OWNER (or Writer) to Bot Calendar
        console.log(`🤝 Granting access to Master (${options.master})...`);
        const aclRes = await client.request({
            method: 'POST',
            url: `/open-apis/calendar/v4/calendars/${encodeURIComponent(botCalendarId)}/acls?user_id_type=open_id`,
            data: {
                role: 'owner', // 'owner', 'writer', 'reader', 'free_busy_reader'
                scope: {
                    type: 'user',
                    user_id: options.master
                }
            }
        });

        if (aclRes.code === 0) {
            console.log(`✅ Master added as OWNER to "OpenClaw Assistant".`);
        } else {
            console.error(`⚠️ Failed to add ACL: ${aclRes.msg} (Code: ${aclRes.code})`);
            // It might fail if already exists, try patching? Or ignore if code indicates existence.
        }

        // 3. Create "Master's Task Calendar" (Managed by Bot)
        console.log('🆕 Creating "Master\'s Task Calendar"...');
        const taskCalRes = await client.request({
            method: 'POST',
            url: '/open-apis/calendar/v4/calendars',
            data: {
                summary: "Master's Task Calendar",
                description: "Shared calendar for tasks managed by OpenClaw.",
                permissions: 'private', 
                color: -1
            }
        });

        if (taskCalRes.code === 0) {
            const taskCalId = taskCalRes.data.calendar.calendar_id;
            console.log(`✅ Created: ${taskCalId}`);

            // Add Master as OWNER to this one too
            const taskAclRes = await client.request({
                method: 'POST',
                url: `/open-apis/calendar/v4/calendars/${encodeURIComponent(taskCalId)}/acls?user_id_type=open_id`,
                data: {
                    role: 'owner',
                    scope: {
                        type: 'user',
                        user_id: options.master
                    }
                }
            });
            
            if (taskAclRes.code === 0) {
                console.log(`✅ Master added as OWNER to "Master's Task Calendar".`);
            } else {
                console.error(`⚠️ Failed to add ACL to Task Calendar: ${taskAclRes.msg}`);
            }

        } else {
            console.error(`❌ Failed to create Task Calendar: ${taskCalRes.msg}`);
        }

        console.log('\n🎉 Setup Complete!');
        console.log(`Bot Calendar ID: ${botCalendarId}`);
        // console.log(`Task Calendar ID: ${taskCalId}`); // Scope issue, printed above

    } catch (e) {
        console.error('Error:', e.message);
        if (e.response) console.error(JSON.stringify(e.response.data));
    }
}

setupSharedCalendar();
