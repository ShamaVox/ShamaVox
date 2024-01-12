import { expect } from '@storybook/jest';
import { fireEvent, userEvent, within } from '@storybook/testing-library';
import { Data } from './data';

export default {
    component: Data,
    title: 'Data',
    args: {
        title: 'Test Task',
        value: 'Test Value',
        delta: 'Test Delta'
    },
    argTypes: {
        title: { 
            control: 'text',
            description: 'The title of the data'
        },
        value: { 
            control: 'text',
            description: 'The value of the data'
        },
        delta: { 
            control: 'text',
            description: 'The delta of the data'
        },
        onClick: {
            description: 'The action to perform when the button is clicked'
        }
    }
};

export const WithButton = {
    argTypes: {
        onClick: {
            action: true,
        }
    },
    play: async ({ args, canvasElement, step }) => {
      const canvas = within(canvasElement);
  
      await step('Can see text elements', async () => {
          await expect(canvas.getByRole('button')).toBeInTheDocument();
          await expect(canvas.getByText(args.title)).toBeInTheDocument();
          
       });
    
    await step('User can click', async () => {
        await fireEvent.mouseEnter(canvas.getByRole('button'));
        await userEvent.click(canvas.getByRole('button'));
      });
    },
  };


export const WithoutButton = {
    play: async ({ args, canvasElement, step }) => {
        const canvas = within(canvasElement);
    
        await step('Button does not load', async () => {
            await expect(canvas.queryByRole('button')).not.toBeInTheDocument();
            // await userEvent.type(canvas.getByTestId('email'), '
        });

        await step('Title does load', async () => {
            await expect(canvas.getByText(args.title)).toBeInTheDocument();
        });

        await step('Value does load', async () => {
            await expect(canvas.getByText(args.value)).toBeInTheDocument();
        })

        await step('Delta does load', async () => {
            await expect(canvas.getByText(args.delta)).toBeInTheDocument();
        })
    }
}


