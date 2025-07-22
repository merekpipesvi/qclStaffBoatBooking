import { GetUserModel } from "@/models/user.model";
import { Button, Modal, Stack, Text } from "@mantine/core";
import { upperFirst } from "@mantine/hooks";
import React from "react";

export const ShowLicenceButton = ({firstName, lastName, pcoc, fishingLicence}: 
  Pick<GetUserModel, 'firstName' | 'lastName' | 'pcoc' | 'fishingLicence'>) => {
    const [showLicence, setShowLicence] = React.useState(false);
    return(
        <>
            <Button onClick={() => setShowLicence(true)} radius='xl'>
                View
            </Button>
            <Modal 
              opened={showLicence} 
              onClose={() => setShowLicence(false)} 
              title={<Text fw={700} size="xl">{`${upperFirst(firstName)} ${upperFirst(lastName)}'s Licences`}</Text>}
            >
                <Stack>
                    <Text fw={700}>
                        Fishing Licence&nbsp;
                        <Text>{fishingLicence}</Text>
                    </Text>
                    <Text fw={700}>
                        PCOC&nbsp;
                        <Text>{pcoc}</Text>
                    </Text>
                </Stack>
            </Modal>
        </>
    )
} 