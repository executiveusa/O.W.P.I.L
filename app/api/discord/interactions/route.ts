import { DiscordClient, verifyDiscordSignature } from '@/lib/agent/discord/client'
import { generateText } from 'ai'
import { getDefaultModel } from '@/lib/agent/providers/openrouter'
import { AGENT_CONFIG } from '@/lib/agent/config'
import { runTask } from '@/lib/agent/loop/task-runner'

export const runtime = 'nodejs'
export const maxDuration = 60

// Discord interaction types
const InteractionType = {
  PING: 1,
  APPLICATION_COMMAND: 2,
  MESSAGE_COMPONENT: 3,
  APPLICATION_COMMAND_AUTOCOMPLETE: 4,
  MODAL_SUBMIT: 5,
}

interface DiscordInteraction {
  id: string
  type: number
  token: string
  data?: {
    name: string
    options?: Array<{
      name: string
      value: string
    }>
  }
  member?: {
    user: {
      id: string
      username: string
    }
  }
  channel_id?: string
}

export async function POST(req: Request) {
  try {
    // Verify request signature
    const signature = req.headers.get('x-signature-ed25519') || ''
    const timestamp = req.headers.get('x-signature-timestamp') || ''
    const body = await req.text()
    const publicKey = process.env.DISCORD_PUBLIC_KEY || ''
    
    if (!verifyDiscordSignature(signature, timestamp, body, publicKey)) {
      return new Response('Invalid signature', { status: 401 })
    }
    
    const interaction: DiscordInteraction = JSON.parse(body)
    
    // Handle PING (Discord verification)
    if (interaction.type === InteractionType.PING) {
      return new Response(JSON.stringify({ type: 1 }), {
        headers: { 'Content-Type': 'application/json' },
      })
    }
    
    // Handle slash commands
    if (interaction.type === InteractionType.APPLICATION_COMMAND) {
      const commandName = interaction.data?.name
      const options = interaction.data?.options || []
      
      const discord = new DiscordClient()
      
      switch (commandName) {
        case 'ask': {
          const prompt = options.find(o => o.name === 'prompt')?.value || ''
          
          // Defer reply for processing
          await discord.deferReply(interaction.id, interaction.token)
          
          try {
            // Generate response
            const model = getDefaultModel()
            const response = await generateText({
              model,
              messages: [
                { role: 'system', content: AGENT_CONFIG.systemPrompt },
                { role: 'user', content: prompt },
              ],
            })
            
            // Send response
            await discord.editReply(interaction.token, {
              content: '',
              embeds: [
                DiscordClient.buildEmbed({
                  title: 'O.W.P.I.L Assistant',
                  description: response.text.substring(0, 4000), // Discord limit
                  color: 'gold',
                  footer: `Asked by ${interaction.member?.user.username}`,
                }),
              ],
            })
          } catch (error) {
            await discord.editReply(interaction.token, {
              content: '',
              embeds: [
                DiscordClient.buildEmbed({
                  title: 'Error',
                  description: error instanceof Error ? error.message : 'An error occurred',
                  color: 'red',
                }),
              ],
            })
          }
          break
        }
        
        case 'task': {
          const description = options.find(o => o.name === 'description')?.value || ''
          
          // Defer reply
          await discord.deferReply(interaction.id, interaction.token)
          
          try {
            // Start the task
            const task = await runTask(description, {
              maxIterations: 5,
              onProgress: async (state) => {
                // Update progress in Discord
                await discord.editReply(interaction.token, {
                  content: '',
                  embeds: [
                    DiscordClient.buildEmbed({
                      title: 'Task in Progress',
                      description: `**${description}**\n\nIteration ${state.iteration}/${state.maxIterations}`,
                      color: 'blue',
                      fields: [
                        { name: 'Current Step', value: state.currentStep || 'Processing...', inline: false },
                      ],
                    }),
                  ],
                })
              },
            })
            
            // Final result
            await discord.editReply(interaction.token, {
              content: '',
              embeds: [
                DiscordClient.buildEmbed({
                  title: task.status === 'completed' ? 'Task Completed' : 'Task Failed',
                  description: task.result?.output || task.error || 'Task finished',
                  color: task.status === 'completed' ? 'green' : 'red',
                  fields: [
                    { name: 'Iterations', value: `${task.iterations}`, inline: true },
                    { name: 'Status', value: task.status, inline: true },
                  ],
                  footer: `Task ID: ${task.id}`,
                }),
              ],
            })
          } catch (error) {
            await discord.editReply(interaction.token, {
              content: '',
              embeds: [
                DiscordClient.buildEmbed({
                  title: 'Task Error',
                  description: error instanceof Error ? error.message : 'Failed to execute task',
                  color: 'red',
                }),
              ],
            })
          }
          break
        }
        
        case 'status': {
          return new Response(JSON.stringify({
            type: 4,
            data: {
              embeds: [
                DiscordClient.buildEmbed({
                  title: 'O.W.P.I.L Status',
                  description: 'The assistant is online and ready.',
                  color: 'green',
                  fields: [
                    { name: 'Version', value: AGENT_CONFIG.version, inline: true },
                    { name: 'Model', value: AGENT_CONFIG.defaultModel.split('/')[1] || AGENT_CONFIG.defaultModel, inline: true },
                  ],
                }),
              ],
            },
          }), {
            headers: { 'Content-Type': 'application/json' },
          })
        }
        
        case 'edit': {
          const section = options.find(o => o.name === 'section')?.value || ''
          const action = options.find(o => o.name === 'action')?.value || ''
          
          // Defer for processing
          await discord.deferReply(interaction.id, interaction.token)
          
          try {
            // Use the task runner to make edits
            const task = await runTask(`Edit the ${section} section of the website: ${action}`, {
              maxIterations: 3,
            })
            
            await discord.editReply(interaction.token, {
              content: '',
              embeds: [
                DiscordClient.buildEmbed({
                  title: task.status === 'completed' ? 'Edit Complete' : 'Edit Failed',
                  description: task.result?.output || task.error || 'Edit operation finished',
                  color: task.status === 'completed' ? 'green' : 'red',
                  fields: [
                    { name: 'Section', value: section, inline: true },
                    { name: 'Action', value: action.substring(0, 100), inline: true },
                  ],
                }),
              ],
            })
          } catch (error) {
            await discord.editReply(interaction.token, {
              content: '',
              embeds: [
                DiscordClient.buildEmbed({
                  title: 'Edit Error',
                  description: error instanceof Error ? error.message : 'Failed to edit',
                  color: 'red',
                }),
              ],
            })
          }
          break
        }
        
        default:
          return new Response(JSON.stringify({
            type: 4,
            data: { content: 'Unknown command' },
          }), {
            headers: { 'Content-Type': 'application/json' },
          })
      }
      
      // ACK - we've handled it via deferred reply
      return new Response(null, { status: 204 })
    }
    
    return new Response(JSON.stringify({ error: 'Unknown interaction type' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    })
  } catch (error) {
    console.error('Discord interaction error:', error)
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : 'Interaction failed' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    )
  }
}
