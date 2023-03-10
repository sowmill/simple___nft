from brownie import SimpleCollectible, network, config
from scripts.helpful_scripts import get_account, OPENSEA_URL
import yaml, json, os, shutil


def deploy_and_create(front_end_update=False):
    account = get_account()
    simple_collectible = SimpleCollectible.deploy(
        {"from": account},
        publish_source=config["networks"][network.show_active()]["verify"],
    )
    if front_end_update:
        update_front_end()
    return simple_collectible


def update_front_end():
    # Send the build folder
    copy_folders_to_front_end("./build", "./frontend/src/chain-info")
    # Sending the front end our config in JSON format
    with open("brownie-config.yaml", "r") as brownie_config:
        config_dict = yaml.load(brownie_config, Loader=yaml.FullLoader)
        with open("./frontend/src/brownie-config.json", "w") as brownie_config_json:
            json.dump(config_dict, brownie_config_json)


def copy_folders_to_front_end(src, dest):
    if os.path.exists(dest):
        shutil.rmtree(dest)
    shutil.copytree(src, dest)


def main():
    deploy_and_create(front_end_update=True)
